function parseMoneyPrecise(str) {
  if (!str) return null;
  const num = parseFloat(str.replace(/[^0-9.,]/g, "").replace(/,/g, "."));
  return Number.isFinite(num) ? num : null;
}
function detectCurrency(str) {
  const m = (str || "").match(/[$€£₴₽₹¥]/);
  return m ? m[0] : "$";
}

export default function getJobBudgetFromDom() {
  const li = Array.from(document.querySelectorAll("li")).find(
    (el) =>
      el.querySelector('[data-test="BudgetAmount"]') &&
      /Fixed|Hourly/i.test(el.querySelector(".description")?.textContent || ""),
  );

  const holder = li || document.querySelector('[data-test="BudgetAmount"]')?.closest("li") || null;
  if (!holder) return { type: null, currency: null, min: null, max: null, label: null };

  const desc = holder.querySelector(".description")?.textContent?.trim() || "";
  const type = /fixed/i.test(desc) ? "fixed" : /hourly/i.test(desc) ? "hourly" : null;

  const amountTexts = Array.from(holder.querySelectorAll('[data-test="BudgetAmount"] strong'))
    .map((el) => (el.textContent || "").trim())
    .filter(Boolean);

  const currency = amountTexts.length ? detectCurrency(amountTexts[0]) : "$";
  const nums = amountTexts.map(parseMoneyPrecise).filter((n) => Number.isFinite(n));

  let min = null,
    max = null,
    label = null;
  if (type === "fixed") {
    min = max = nums[0] ?? null;
    label = nums[0] != null ? `${currency}${nums[0]}` : null;
  } else if (type === "hourly") {
    min = nums[0] ?? null;
    max = nums[1] ?? null;
    if (min != null && max != null) label = `${currency}${min} – ${currency}${max}/hr`;
    else if (min != null) label = `${currency}${min}/hr`;
  }

  return { type, currency, min, max, label };
}
