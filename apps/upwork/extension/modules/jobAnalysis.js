import getJobBudgetFromDom from "./getJobBudgetFromDom.js";

export function analyzeJob() {
  const activityTxt = getSectionText(/Activity on this job/i) || document.body.innerText;
  const clientTxt = getSectionText(/About the client/i) || document.body.innerText;

  const proposalsRaw = pick(activityTxt, /Proposals:\s*([^\n]+)/i);
  const interviewing = toInt(pick(activityTxt, /Interviewing:\s*(\d+)/i));
  const invitesSent = toInt(pick(activityTxt, /Invites sent:\s*(\d+)/i));
  const unansweredInvites = toInt(pick(activityTxt, /Unanswered invites:\s*(\d+)/i));
  const hiresOnThisJob = toInt(pick(activityTxt, /Hir(?:ed|es?):\s*(\d+)/i));
  const lastViewedRaw = pick(activityTxt, /Last viewed by client:\s*([^\n]+)/i);
  const lastViewedMinutes = parseLastViewedToMinutes(lastViewedRaw);

  const paymentVerified = /Payment method verified/i.test(clientTxt);
  const totalSpent = getClientSpendFromDom() ?? parseMoney(pick(clientTxt, /(Total\s+spent|Spent)\s*\$[\d,]+/i));

  const { hireRate, jobsPosted, hiresTotal } = getClientStatsFromDom(clientTxt);
  const { avgHourlyPaid, totalHours } = getClientPayStatsFromDom(clientTxt);

  let avgProjectValue = null;
  if (typeof totalSpent === "number") {
    if (hiresTotal && hiresTotal > 0) {
      avgProjectValue = Math.round(totalSpent / hiresTotal);
    } else if (jobsPosted && jobsPosted > 0) {
      avgProjectValue = Math.round(totalSpent / jobsPosted);
    }
  }

  const budget = getJobBudgetFromDom();
  const recent = extractClientRecentHistory(5);
  const connects = getConnectsInfoFromDom();

  return {
    proposals: proposalsRaw,
    jobType: budget.type,
    budget,
    metrics: {
      paymentVerified,
      totalSpent,
      jobsPosted,
      hiresTotal,
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
      connects,
      recentReviews: recent,
    },
  };
}

function getClientStatsFromDom(clientTxtFallback = "") {
  let hireRate = null,
    jobsPosted = null,
    hiresTotal = null;

  const statEls = document.querySelectorAll('[data-qa="client-job-posting-stats"]');
  statEls.forEach((el) => {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    const mj = t.match(/(\d+)\s+jobs?\s+posted/i);
    if (mj) jobsPosted = toInt(mj[1]);
    const mh = t.match(/(\d{1,3})%\s*hire rate/i);
    if (mh) hireRate = toInt(mh[1]);
  });

  const hiresEl =
    document.querySelector('[data-qa="client-hires"]') || document.querySelector('[data-qa="client-spend"]');
  const hiresText = hiresEl?.parentElement?.textContent || hiresEl?.textContent || clientTxtFallback || "";
  const mhTotal = hiresText.match(/(\d+)\s+hires?\b/i);
  if (mhTotal) hiresTotal = toInt(mhTotal[1]);

  if (jobsPosted == null || hireRate == null || hiresTotal == null) {
    const txt = clientTxtFallback || getSectionText(/About the client/i) || document.body.innerText;
    if (jobsPosted == null) {
      const mj = txt.match(/(\d+)\s+jobs?\s+posted/i);
      if (mj) jobsPosted = toInt(mj[1]);
    }
    if (hireRate == null) {
      const mh = txt.match(/hire rate[,:]?\s*(\d{1,3})%/i);
      if (mh) hireRate = toInt(mh[1]);
    }
    if (hiresTotal == null) {
      const mh2 = txt.match(/(\d+)\s+hires?\b/i);
      if (mh2) hiresTotal = toInt(mh2[1]);
    }
  }

  return { hireRate, jobsPosted, hiresTotal };
}

function getClientPayStatsFromDom(clientTxtFallback = "") {
  let avgHourlyPaid = null;
  let totalHours = null;

  const rateEl = document.querySelector('[data-qa="client-hourly-rate"]');
  if (rateEl) {
    const m = (rateEl.textContent || "").match(/\$?\s*([\d.,]+)/);
    if (m) avgHourlyPaid = numLocale(m[1]);
  }

  const hoursEl = document.querySelector('[data-qa="client-hours"]');
  if (hoursEl) {
    const mh = (hoursEl.textContent || "").match(/([\d.,]+)/);
    if (mh) totalHours = Math.round(numLocale(mh[1]) ?? 0);
  }

  if (avgHourlyPaid == null) {
    const txt = clientTxtFallback || getSectionText(/About the client/i) || document.body.innerText;
    avgHourlyPaid = numLocale(pick(txt, /\$([\d.,]+)\s*\/\s*hr\s*avg hourly rate paid/i));
  }
  if (totalHours == null) {
    const txt = clientTxtFallback || getSectionText(/About the client/i) || document.body.innerText;
    totalHours = Math.round(numLocale(pick(txt, /(\d[\d,]*)\s+hours\b/i)) ?? 0);
  }

  return { avgHourlyPaid, totalHours };
}

function extractClientRecentHistory(limit = 5) {
  const section = document.querySelector('section[data-cy="jobs"]');
  if (!section) {
    return { count: 0, avgReceived: null, avgGiven: null, totalPaid: null, paidAvg: null, currency: "$" };
  }

  const items = Array.from(section.querySelectorAll('[data-cy="job"]')).slice(0, limit);

  const toNum = (s) => {
    if (!s) return null;
    const m = String(s).match(/[\d.,]+/);
    return m ? parseFloat(m[0].replace(/,/g, ".")) : null;
  };

  function parseMoneySmart(statsTxt) {
    if (!statsTxt) return null;
    const txt = String(statsTxt).replace(/\s+/g, " ");

    let m = txt.match(/Billed:\s*([$€£₴₽₹¥])\s*([\d.,]+)/i);
    if (m) return { amount: numLocale(m[2]), currency: m[1] };

    m = txt.match(/Fixed[-\s]?price\s*([$€£₴₽₹¥])\s*([\d.,]+)/i);
    if (m) return { amount: numLocale(m[2]), currency: m[1] };

    m = txt.match(/(\d+(?:[.,]\d+)?)\s*(?:hrs?|hours?)\s*@\s*([$€£₴₽₹¥])\s*([\d.,]+)\s*\/\s*hr\b/i);
    if (m) {
      const hours = numLocale(m[1]);
      const rate = numLocale(m[3]);
      if (Number.isFinite(hours) && Number.isFinite(rate)) {
        return { amount: Math.round(hours * rate * 100) / 100, currency: m[2] };
      }
    }

    m = txt.match(/([$€£₴₽₹¥])\s*([\d.,]+)/);
    if (m) return { amount: numLocale(m[2]), currency: m[1] };

    return null;
  }

  const rows = items.map((item) => {
    let received = null;
    const allRatings = item.querySelectorAll('[data-test="UpCRating"] .air3-rating-value-text');
    for (const el of allRatings) {
      if (!el.closest('[data-test="FeedbackToFreelancer"]')) {
        received = toNum(el.textContent);
        break;
      }
    }

    const given = toNum(
      item.querySelector('[data-test="FeedbackToFreelancer"] [data-test="UpCRating"] .air3-rating-value-text')
        ?.textContent,
    );

    const statsTxt = (item.querySelector('[data-cy="stats"]') || item.querySelector(".stats"))?.textContent || "";
    const paidObj = parseMoneySmart(statsTxt);

    return { received, given, paid: paidObj?.amount ?? null, cur: paidObj?.currency ?? null };
  });

  const filt = (arr) => arr.filter((x) => typeof x === "number" && Number.isFinite(x));
  const avg = (arr) => (arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : null);
  const sum = (arr) => (arr.length ? +arr.reduce((a, b) => a + b, 0).toFixed(2) : null);

  const recVals = filt(rows.map((r) => r.received));
  const givVals = filt(rows.map((r) => r.given));
  const paidVals = filt(rows.map((r) => r.paid));

  const currency = rows.find((r) => r.cur)?.cur || "$";

  return {
    count: items.length,
    avgReceived: avg(recVals),
    avgGiven: avg(givVals),
    totalPaid: sum(paidVals),
    paidAvg: avg(paidVals),
    currency,
  };
}

function getSectionText(titleRe) {
  const hs = Array.from(document.querySelectorAll("h2,h3"));
  const h = hs.find((el) => titleRe.test(el.textContent || ""));
  if (!h) return "";
  let box = h.closest("section,aside,div") || h.parentElement;
  for (let i = 0; i < 3 && box && (box.innerText || "").length < 120; i++) box = box.parentElement;
  return (box && box.innerText) || "";
}

function getConnectsInfoFromDom() {
  const box = document.querySelector('[data-test="ConnectsAuction"]') || document.body;

  const text = (box.textContent || "").replace(/\s+/g, " ");
  const mReq =
    text.match(/(?:Send|Submit)\s+a\s+proposal\s+for:\s*([0-9]+)\s+Connects/i) ||
    text.match(/\b([0-9]+)\s+Connects\b/i);
  const required = mReq ? parseInt(mReq[1], 10) : null;

  const mAvail = text.match(/Available\s+Connects:\s*([0-9]+)/i);
  const available = mAvail ? parseInt(mAvail[1], 10) : null;

  const costUSD = required != null && Number.isFinite(required) ? +(required * 0.15).toFixed(2) : null;

  return { required, available, costUSD };
}

const pick = (txt, re, i = 1) => (txt.match(re) || [])[i] || null;
const toInt = (v) => (v == null ? null : parseInt(String(v).replace(/[^\d]/g, ""), 10));
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
  if (less) return Math.round(numLocale(less[1]) ?? 0);

  const m = txt.match(/\$?\s*([\d.,]+)\s*([kKmM])?/);
  if (!m) return null;
  const num = parseFloat(m[1].replace(",", "."));
  const suffix = (m[2] || "").toLowerCase();
  const mult = suffix === "k" ? 1_000 : suffix === "m" ? 1_000_000 : 1;
  const val = Math.round(num * mult);
  return Number.isFinite(val) ? val : null;
}

function numLocale(s) {
  if (s == null) return null;
  let t = String(s).replace(/\s/g, "");
  if (t.includes(",") && t.includes("."))
    t = t.replace(/,/g, ""); // 4,385.87 -> 4385.87
  else if (t.includes(",")) t = t.replace(/,/g, "."); // 4385,87 -> 4385.87
  const v = parseFloat(t);
  return Number.isFinite(v) ? v : null;
}
