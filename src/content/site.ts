// All page content lives here. Every value marked ⚑ Dxx is dummy content:
// see website/TO-CHANGE.md for the full list and what to replace it with.
// Add ?dummy to the URL to outline every dummy item on the page.

export const contact = {
  whatsappNumber: "923000000000", // ⚑ D01 (international format, no +)
  whatsappDisplay: "+92 300 0000000", // ⚑ D01
  email: "hello@reputra.pk", // ⚑ D02
  city: "Lahore", // ⚑ D03
  timeZone: "Asia/Karachi",
  address: "Office 12, Main Boulevard, Gulberg III, Lahore", // ⚑ D04
  socials: {
    instagram: "https://instagram.com/reputra", // ⚑ D05
    facebook: "https://facebook.com/reputra", // ⚑ D05
    linkedin: "https://linkedin.com/company/reputra", // ⚑ D05
  },
  domain: "reputra.pk", // ⚑ D06
};

export function whatsappLink(text: string) {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// One wording for the primary action, everywhere. ⚑ D10
export const offer = {
  freeTrial: "Start free month",
  freeTrialShort: "Start free month",
  whatsappNote: "Opens WhatsApp with a message ready to send.",
  firstMessage: "Assalam o Alaikum! I'd like to start a free month of Reputra for my clinic.",
};

// Honest trust: the person behind Reputra. ⚑ D35 name, D36 photo, D37 note
export const founder = {
  name: "[Your name]", // ⚑ D35
  role: "Founder, Reputra",
  city: "Lahore",
  photo: null as string | null, // ⚑ D36 put the photo in public/images/founder.jpg and set "/images/founder.jpg"
  note: "I set up every clinic myself, in person. If the stand and the card don't bring you more Google reviews in the first month, you don't pay anything.", // ⚑ D37
};

// Founding-clinics offer: honest framing until real results exist. ⚑ D38
export const foundingOffer = {
  line: "Founding clinics in Lahore: first month free, set up in person.",
  spotsNote: "We're starting with a small number of clinics so we can set each one up properly.",
};

// Hero estimate. reviews next month = reviews now + patients a day × workingDays × reviewRate
export const estimate = {
  reviewRate: 0.08, // ⚑ D12 — 8 in 100 patients asked leave a review
  workingDays: 26, // ⚑ D13
  defaultPatients: 25, // ⚑ D14
  defaultReviews: 18, // ⚑ D14
  minPatients: 5,
  maxPatients: 80,
  maxReviews: 300,
};

export const demoClinic = {
  name: "Smile Dental Clinic", // ⚑ D15
  initials: "SD", // ⚑ D15
  area: "DHA Phase 5, Lahore", // ⚑ D15
  rating: 4.6, // ⚑ D15
  slug: "smile-dental", // ⚑ D15
};

// The rules Reputra follows (Google's review policy). Real, not marketing.
export const rules = [
  "Every patient sees the Google button, happy or not.",
  "No gifts or discounts for reviews.",
  "No fake reviews, ever.",
  "WhatsApp messages go one at a time from your own number.",
];

export type Status = "Reviewed" | "Opened" | "Sent" | "Feedback";

// "Today at reception" board. ⚑ D16 (patients) / D17 (staff)
export const boardRows: {
  name: string;
  by: string;
  channel: string;
  time: string;
  status: Status;
  detail: { stars: string; speed: string; message: string };
}[] = [
  { name: "Ayesha K.", by: "Sana", channel: "NFC tap", time: "10:12", status: "Reviewed", detail: { stars: "5 stars at 10:13", speed: "One minute from tap to review.", message: "Tapped the NFC card at the counter." } },
  { name: "Bilal R.", by: "Sana", channel: "WhatsApp", time: "10:40", status: "Opened", detail: { stars: "Opened the page at 10:52", speed: "No review yet. A reminder can go out in two days.", message: "\"Assalam o Alaikum Bilal! Shukriya Smile Dental visit karne ka…\"" } },
  { name: "Hira M.", by: "Dr. Imran", channel: "QR stand", time: "11:05", status: "Reviewed", detail: { stars: "5 stars at 11:07", speed: "Two minutes from scan to review.", message: "Scanned the QR stand in the waiting room." } },
  { name: "Usman T.", by: "Sana", channel: "WhatsApp", time: "11:32", status: "Reviewed", detail: { stars: "5 stars at 11:34", speed: "Two minutes from message to review.", message: "\"Assalam o Alaikum Usman! Shukriya Smile Dental visit karne ka. Please 30 seconds mein Google pe review dein.\"" } },
  { name: "Fatima Z.", by: "Kamran", channel: "NFC tap", time: "12:10", status: "Sent", detail: { stars: "Waiting", speed: "Page not opened yet.", message: "Tapped the card at 12:10." } },
  { name: "Ahmed S.", by: "Kamran", channel: "WhatsApp", time: "12:48", status: "Opened", detail: { stars: "Opened at 13:02", speed: "No review yet.", message: "\"Assalam o Alaikum Ahmed! Shukriya…\"" } },
  { name: "Mariam A.", by: "Sana", channel: "QR stand", time: "13:15", status: "Feedback", detail: { stars: "Private feedback", speed: "Sent to the owner at 13:16. The Google button stayed on her screen.", message: "\"Waiting time was long, but the doctor was very kind.\"" } },
  { name: "Zain H.", by: "Dr. Imran", channel: "WhatsApp", time: "14:02", status: "Sent", detail: { stars: "Waiting", speed: "Message delivered.", message: "\"Assalam o Alaikum Zain! Shukriya…\"" } },
  { name: "Noor F.", by: "Sana", channel: "NFC tap", time: "14:30", status: "Reviewed", detail: { stars: "5 stars at 14:31", speed: "One minute from tap to review.", message: "Tapped the NFC card at the counter." } },
];

// Rows that "arrive" live on the board, one every few seconds. ⚑ D16 / D17
export const incomingRows = [
  { name: "Saad Q.", by: "Kamran", channel: "NFC tap" },
  { name: "Amna J.", by: "Sana", channel: "WhatsApp" },
  { name: "Hamza P.", by: "Dr. Imran", channel: "QR stand" },
];

export const leaderboard = [
  { name: "Sana", count: 22 }, // ⚑ D17 (the three add up to monthlyReport.newReviews = 46)
  { name: "Kamran", count: 15 }, // ⚑ D17
  { name: "Dr. Imran", count: 9 }, // ⚑ D17
];

// Sample dashboard numbers for the demo clinic, kept consistent with the monthly report. ⚑ D18
export const weeklyStats = { scans: 142, clicks: 61, whatsapp: 38, newReviews: 12 }; // ⚑ D18

export const monthlyReport = { month: "October", reviewsBefore: 18, newReviews: 46, reviewsAfter: 64, rating: 4.8, ratingBefore: 4.6, topStaff: "Sana (22)" }; // ⚑ D19 sample data, label it as an example

export const feedbackExample = {
  name: "Mariam A.", // ⚑ D20
  time: "13:16",
  message: "Waiting time was long, but the doctor was very kind.", // ⚑ D20
};

export const plans = [
  {
    name: "Basic",
    price: "PKR 3,999", // ⚑ D07
    period: "a month · one doctor, one counter",
    cta: "Start free month",
    featured: false,
  },
  {
    name: "Pro",
    price: "PKR 7,999", // ⚑ D07
    period: "a month · clinics, most chosen",
    cta: "Start free month",
    featured: true,
  },
  {
    name: "Business",
    price: "PKR 14,999", // ⚑ D07
    period: "a month and up · branches",
    cta: "Talk to us",
    featured: false,
  },
];

// ⚑ D11 what each plan includes: [Basic, Pro, Business]
export const planRows: { label: string; values: [string, string, string] }[] = [
  { label: "Locations", values: ["1", "1", "Several branches"] },
  { label: "QR, NFC and WhatsApp links", values: ["Included", "Included", "Included"] },
  { label: "Stats and before-after count", values: ["Included", "Included", "Included"] },
  { label: "Staff leaderboard", values: ["Not included", "Included", "Included"] },
  { label: "Monthly report on WhatsApp", values: ["Not included", "Included", "Included"] },
  { label: "Private feedback alerts", values: ["Email", "WhatsApp and email", "WhatsApp and email"] },
  { label: "Support", values: ["WhatsApp", "WhatsApp, same day", "A named person"] },
];

export const setupPack = "PKR 3,000–6,000 once"; // ⚑ D08
export const yearlyOffer = "Pay yearly and get two months free."; // ⚑ D09

export const faqs = [
  {
    q: "Is this allowed by Google?",
    a: "Yes. We only link to Google's own review box, every patient sees the Google button, and we never offer gifts for reviews. Those are Google's rules, and Reputra is built around them.",
  },
  {
    q: "Does the patient need an app?",
    a: "No. They scan the QR code or tap the card, a page opens in their browser, and one more tap opens Google's review box.",
  },
  {
    q: "Will my WhatsApp number get banned?",
    a: "No. Messages go one at a time from your own WhatsApp, sent by your staff to patients who visited. We don't use bulk-sending tools.",
  },
  {
    q: "What if a patient is unhappy?",
    a: "They can send you private feedback first, and you get an alert. The Google button stays on their screen too, because hiding it is against Google's rules.",
  },
  {
    q: "How do I pay?",
    a: "Raast, JazzCash, Easypaisa or bank transfer, monthly or yearly. Pay yearly and you get two months free.",
  },
  {
    q: "How long does setup take?",
    a: "About ten minutes. We find your Google review link, make your page, bring the stand and the card, and show your staff how to ask.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, any month, with no fee. The stand and the card stay with you.",
  },
];

// Sample photographs (Unsplash licence, free for commercial use). ⚑ D22: replace with your own clinic photos.
export const photos = {
  dentalChair: { src: "/images/dental-chair.jpg", alt: "A dental chair and instruments in a clinic", who: "Quang Tri Nguyen", url: "https://unsplash.com/@quangtri", w: 1200, h: 1800 },
  clinicReception: { src: "/images/clinic-reception.jpg", alt: "A calm, modern clinic reception with a curved wooden wall", who: "Medicinos Rinkodara", url: "https://unsplash.com/@valuebranding", w: 1600, h: 1067 },
  dentistXray: { src: "/images/dentist-xray.jpg", alt: "A dentist reading dental X-rays on a light panel", who: "Harold Hisona", url: "https://unsplash.com/@harold_angus", w: 1600, h: 1200 },
  dentistPatient: { src: "/images/dentist-patient.jpg", alt: "A dentist treating a patient in the dental chair", who: "Shedrack Salami", url: "https://unsplash.com/@xtrovarts", w: 1600, h: 900 },
  receptionCounter: { src: "/images/reception-counter.jpg", alt: "A long reception counter in a bright lobby", who: "Pranab Debnath", url: "https://unsplash.com/@pranabpictures", w: 1600, h: 1600 },
  phoneHand: { src: "/images/phone-hand.jpg", alt: "A hand holding a smartphone", who: "Andrey Matveev", url: "https://unsplash.com/@zelebb", w: 1600, h: 1600 },
};

export const credits = Object.values(photos).map((p) => ({ what: p.alt, who: p.who, source: "Unsplash", url: p.url })); // ⚑ D22

