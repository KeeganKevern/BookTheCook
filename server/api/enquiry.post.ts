import { FieldValue } from "firebase-admin/firestore";
import { BUDGETS, MAX_GUESTS, OCCASIONS } from "../../utils/enquiryOptions";

// Receives both forms (booking requests and contact messages), checks every
// field, saves to the `enquiries` collection and emails the notification inbox.

type Enquiry = Record<string, string | number | boolean | null>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const PHONE_RE = /^[+\d][\d\s()-]{6,19}$/;

function text(value: unknown, field: string, max: number, required: boolean): string | null {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) {
    if (required) throw bad(`${field} is required.`);
    return null;
  }
  if (v.length > max) throw bad(`${field} is too long.`);
  return v;
}

function bad(message: string) {
  return createError({ statusCode: 400, statusMessage: "Invalid enquiry", data: { message } });
}

function validateBooking(body: any): Enquiry {
  const email = text(body.email, "Email", 320, true)!;
  if (!EMAIL_RE.test(email)) throw bad("Please enter a valid email address.");

  const date = text(body.eventDate, "Event date", 10, true)!;
  const eventDay = new Date(`${date}T00:00:00Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const latest = new Date(today);
  latest.setUTCFullYear(latest.getUTCFullYear() + 2);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(eventDay.getTime())) throw bad("Please choose a valid date.");
  if (eventDay < today) throw bad("The event date can't be in the past.");
  if (eventDay > latest) throw bad("We take bookings up to two years ahead.");

  const guests = Number(body.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    throw bad(`Number of guests must be between 1 and ${MAX_GUESTS}.`);
  }

  const postcode = text(body.postcode, "Postcode", 10, true)!.toUpperCase();
  if (!POSTCODE_RE.test(postcode)) throw bad("Please enter a valid UK postcode.");

  const phone = text(body.phone, "Phone", 20, false);
  if (phone && !PHONE_RE.test(phone)) throw bad("Please enter a valid phone number.");

  const occasion = text(body.occasion, "Occasion", 40, false);
  if (occasion && !(OCCASIONS as readonly string[]).includes(occasion)) throw bad("Please choose an occasion from the list.");

  const budget = text(body.budget, "Budget", 40, false);
  if (budget && !(BUDGETS as readonly string[]).includes(budget)) throw bad("Please choose a budget from the list.");

  if (body.privacyAccepted !== true) throw bad("Please confirm you've read the privacy notice.");

  return {
    type: "booking",
    name: text(body.name, "Name", 200, true),
    email,
    phone,
    eventDate: date,
    guests,
    town: text(body.town, "Town", 100, true),
    postcode,
    occasion,
    dietary: text(body.dietary, "Dietary requirements", 2000, false),
    budget,
    message: text(body.message, "Message", 5000, false),
  };
}

function validateContact(body: any): Enquiry {
  const email = text(body.email, "Email", 320, true)!;
  if (!EMAIL_RE.test(email)) throw bad("Please enter a valid email address.");
  return {
    type: "contact",
    name: text(body.name, "Name", 200, true),
    email,
    message: text(body.message, "Message", 5000, true),
  };
}

const LABELS: Record<string, string> = {
  name: "Name", email: "Email", phone: "Phone", eventDate: "Event date", guests: "Guests",
  town: "Town", postcode: "Postcode", occasion: "Occasion", dietary: "Dietary requirements",
  budget: "Budget per head", message: "Message",
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function notify(enquiry: Enquiry) {
  const config = useRuntimeConfig();
  if (!config.resendApiKey || !config.notifyEmail) {
    console.warn("[enquiry] Resend not configured; saved without emailing");
    return;
  }
  const isBooking = enquiry.type === "booking";
  const subject = isBooking
    ? `Booking request: ${enquiry.name}, ${enquiry.eventDate}, ${enquiry.guests} guests`
    : `Contact message from ${enquiry.name}`;
  const rows = Object.entries(LABELS)
    .filter(([key]) => enquiry[key] !== null && enquiry[key] !== undefined)
    .map(([key, label]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${label}</td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(String(enquiry[key]))}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "BookTheCook <onboarding@resend.dev>",
      to: [config.notifyEmail],
      reply_to: enquiry.email,
      subject,
      html: `<p>New ${isBooking ? "booking request" : "contact message"} from the website. Reply to this email to answer the customer.</p><table>${rows}</table>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || typeof body !== "object") throw bad("Missing form data.");

  // Honeypot: a hidden field people never see. Bots fill it in; pretend success and drop it.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return { ok: true };
  }

  const enquiry =
    body.type === "booking" ? validateBooking(body)
    : body.type === "contact" ? validateContact(body)
    : (() => { throw bad("Unknown form type."); })();

  try {
    await adminDb().collection("enquiries").add({
      ...enquiry,
      status: "New",
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("[enquiry] save failed", err);
    throw createError({ statusCode: 500, statusMessage: "Could not save enquiry" });
  }

  // The enquiry is saved even if the email fails, so the chef still sees it in Back of House.
  try {
    await notify(enquiry);
  } catch (err) {
    console.error("[enquiry] email failed", err);
  }

  return { ok: true };
});
