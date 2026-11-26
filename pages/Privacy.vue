<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-8 text-gray-700 dark:text-gray-300">

    <section class="space-y-2">
      <h2 class="text-2xl font-bold text-black dark:text-white">Privacy notice</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">Last updated <time datetime="2026-11-18">18 November 2026</time></p>
      <p>
        This notice explains what happens to the details you give us when you send a booking request
        or a message through this website.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">Who we are</h3>
      <p>
        BookTheCook is run by Chef Kevern, a sole trader providing private chef services in people's homes.
        Chef Kevern is responsible for your personal data (the "data controller" under UK data protection law).
      </p>
      <p>
        To ask about your data, use the <NuxtLink to="/Contact" class="underline">contact page</NuxtLink>
        and say your message is about privacy.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">What we collect</h3>
      <p><strong>Booking requests:</strong> your name, email address, phone number (if you give it), event date,
        number of guests, town and postcode, and anything you choose to tell us about the occasion, your budget,
        dietary requirements or allergies.</p>
      <p><strong>Contact messages:</strong> your name, email address and your message.</p>
      <p>
        Dietary requirements can sometimes reveal health or religious information. Only tell us what we need
        to cook safely for you; we use it for nothing else.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">Why we use it</h3>
      <ul class="list-disc pl-6 space-y-1">
        <li>To reply to your request, plan a menu and send you a quote. This is a step you've asked us to take
          before agreeing a booking.</li>
        <li>To answer your message. We have a legitimate interest in replying to people who contact us.</li>
        <li>If you book, to arrange and deliver the booking, and to keep the records the law requires.</li>
      </ul>
      <p>We don't send marketing, sell your details, or use them to make automated decisions about you.</p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">Who sees it</h3>
      <ul class="list-disc pl-6 space-y-1">
        <li>Chef Kevern.</li>
        <li>A website administrator who helps run the site and receives a copy of each request by email.</li>
        <li>Companies that run the website for us, only as needed to provide their service: Google Firebase
          (stores requests), Netlify (hosts the website) and Resend (delivers notification emails).</li>
      </ul>
      <p>
        Some of these companies store data outside the UK, including in the United States. Where that happens,
        your data is protected by safeguards recognised under UK law, such as the UK–US data bridge or
        approved contract terms.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">How long we keep it</h3>
      <p>
        We keep booking requests and messages for 12 months after we were last in touch, then delete them.
        If you go on to book, we keep the details needed for our business and tax records for as long as the
        law requires.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">Your rights</h3>
      <p>You can ask us to:</p>
      <ul class="list-disc pl-6 space-y-1">
        <li>give you a copy of the data we hold about you</li>
        <li>correct anything that's wrong</li>
        <li>delete your data</li>
        <li>stop or limit how we use it</li>
        <li>send your data to you or another organisation in a common format</li>
      </ul>
      <p>
        Ask through the <NuxtLink to="/Contact" class="underline">contact page</NuxtLink>. We'll reply within
        one month. It's free.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">Complaints</h3>
      <p>
        If you're unhappy with how we've handled your data, please tell us first so we can put it right.
        You can also complain to the Information Commissioner's Office (ICO) at
        <a href="https://ico.org.uk/make-a-complaint/" class="underline" target="_blank" rel="noopener">ico.org.uk/make-a-complaint</a>
        or on 0303 123 1113.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">Cookies</h3>
      <p>
        This website doesn't use analytics, advertising or tracking cookies. Your browser remembers whether
        you chose light or dark mode, and that setting stays on your device. The chef's login uses your
        browser's storage only when the chef signs in.
      </p>
    </section>

    <section class="space-y-2">
      <h3 :class="h3">Changes to this notice</h3>
      <p>If we change how we use your data, we'll update this page and the date at the top.</p>
    </section>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ headerTitle: "Privacy" });

const h3 = "text-lg font-semibold text-black dark:text-white";
</script>
