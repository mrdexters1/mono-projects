export function analyzeJob() {
  // Sections as text
  const activityTxt = getSectionText(/Activity on this job/i) || document.body.innerText;
  const clientTxt = getSectionText(/About the client/i) || document.body.innerText;
  const historyTxt = getSectionText(/Client[’'s]? recent history/i) || "";

  // Activity
  const proposalsRaw = pick(activityTxt, /Proposals:\s*([^\n]+)/i);
  const interviewing = toInt(pick(activityTxt, /Interviewing:\s*(\d+)/i));
  const invitesSent = toInt(pick(activityTxt, /Invites sent:\s*(\d+)/i));
  const unansweredInvites = toInt(pick(activityTxt, /Unanswered invites:\s*(\d+)/i));
  const hiresOnThisJob = toInt(pick(activityTxt, /Hir(?:ed|es?):\s*(\d+)/i));
  const lastViewedRaw = pick(activityTxt, /Last viewed by client:\s*([^\n]+)/i);
  const lastViewedMinutes = parseLastViewedToMinutes(lastViewedRaw);

  // Client
  const paymentVerified = /Payment method verified/i.test(clientTxt);
  const totalSpent = getClientSpendFromDom() ?? parseMoney(pick(clientTxt, /(Total\s+spent|Spent)\s*\$[\d,]+/i));
  const jobsPosted = toInt(pick(clientTxt, /(\d+)\s+jobs?\s+posted/i));
  const hireRate = toInt(pick(clientTxt, /hire rate[,:]?\s*(\d{1,3})%/i));
  const avgHourlyPaid = toFloat(pick(clientTxt, /\$([\d.,]+)\s*\/\s*hr\s*avg hourly rate paid/i));
  const totalHours = toInt(pick(clientTxt, /(\d[\d,]*)\s+hours\b/i));
  const clientCountry = pick(clientTxt, /\n([A-Z][A-Za-z ]+)\n(?:\d{1,2}:\d{2}\s*(?:AM|PM)|Member since)/) || null;

  // Reviews (rough)
  const ratings = Array.from(historyTxt.matchAll(/\b([0-5](?:\.\d)?)\b/g))
    .map((m) => parseFloat(m[1]))
    .filter((x) => x <= 5);
  const positiveReviews = ratings.filter((x) => x >= 4.5).length;

  const avgProjectValue = totalSpent && jobsPosted ? Math.round(totalSpent / Math.max(1, jobsPosted)) : null;

  return {
    page: "job",
    proposals: proposalsRaw,
    metrics: {
      paymentVerified,
      totalSpent,
      jobsPosted,
      avgProjectValue,
      hireRate,
      avgHourlyPaid,
      totalHours,
      interviewing,
      invitesSent,
      unansweredInvites,
      hiresOnThisJob,
      lastViewedRaw,
      lastViewedMinutes,
      clientCountry,
      reviews: { count: ratings.length, positive: positiveReviews },
    },
  };
}

// ----------------- helpers -----------------
function getSectionText(titleRe) {
  const hs = Array.from(document.querySelectorAll("h2,h3"));
  const h = hs.find((el) => titleRe.test(el.textContent || ""));
  if (!h) return "";
  let box = h.closest("section,aside,div") || h.parentElement;
  for (let i = 0; i < 3 && box && (box.innerText || "").length < 120; i++) box = box.parentElement;
  return (box && box.innerText) || "";
}
const pick = (txt, re, i = 1) => (txt.match(re) || [])[i] || null;
const toInt = (v) => (v == null ? null : parseInt(String(v).replace(/[^\d]/g, ""), 10));
const toFloat = (v) =>
  v == null
    ? null
    : parseFloat(
        String(v)
          .replace(/,/g, ".")
          .replace(/[^\d.]/g, ""),
      );

const parseMoney = (txt) => toInt((txt || "").match(/\$[\d,]+/)?.[0]);
function parseLastViewedToMinutes(s) {
  if (!s) return null;
  const m = s.match(/(\d+)\s+(minute|hour|day)s?/i);
  if (!m) return null;
  const num = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit.startsWith("minute")) return num;
  if (unit.startsWith("hour")) return num * 60;
  if (unit.startsWith("day")) return num * 1440;
  return null;
}

function getClientSpendFromDom() {
  const el = document.querySelector('[data-qa="client-spend"]');
  if (!el) return null;
  const txt = (el.textContent || "").trim();

  const less = txt.match(/less than\s*\$?\s*([\d.,]+)/i);
  if (less) return Math.round(parseFloat(less[1].replace(",", ".")));

  const m = txt.match(/\$?\s*([\d.,]+)\s*([kKmM])?/);
  if (!m) return null;
  const num = parseFloat(m[1].replace(",", "."));
  const suffix = (m[2] || "").toLowerCase();
  const mult = suffix === "k" ? 1_000 : suffix === "m" ? 1_000_000 : 1;

  const val = Math.round(num * mult);
  return Number.isFinite(val) ? val : null;
}
