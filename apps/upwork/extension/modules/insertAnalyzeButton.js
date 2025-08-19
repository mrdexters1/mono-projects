import { analyzeJob } from "./jobAnalysis.js";

const API_MATCH = "https://freelanceai.tech/api/match";
const AI_WORKS = true;
const HOST_ATTR = "data-analyze-host";

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);

async function analyzeViaServer(payload) {
  const res = await fetch(API_MATCH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page: "job", ...payload }),
  });
  if (!res.ok) throw new Error("Server error " + res.status);
  return res.json();
}

function createToast(shadow) {
  let el = null,
    timer = null;

  function show(html, { timeout = 0 } = {}) {
    if (el) {
      clearTimeout(timer);
      el.remove();
      el = null;
    }
    el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `
      <div class="toast-head">
        <strong>Upwork AI Job Analyzer</strong>
        <button class="toast-close" aria-label="Close">×</button>
      </div>
      ${html}
    `;
    shadow.appendChild(el);

    el.querySelector(".toast-close").addEventListener("click", () => {
      clearTimeout(timer);
      el.remove();
      el = null;
    });

    if (timeout > 0) {
      const arm = () => {
        timer = setTimeout(() => {
          el?.remove();
          el = null;
        }, timeout);
      };
      const dis = () => clearTimeout(timer);
      arm();
      el.addEventListener("mouseenter", dis);
      el.addEventListener("mouseleave", arm);
    }
  }

  return { show };
}

export async function insertAnalyzeButton() {
  if (document.querySelector(`[${HOST_ATTR}]`)) return;

  const host = document.createElement("div");
  host.setAttribute(HOST_ATTR, "1");
  const shadow = host.attachShadow({ mode: "open" });
  document.documentElement.appendChild(host);

  // styles
  const readCss = async (path) => (await fetch(chrome.runtime.getURL(path))).text().catch(() => "");
  const [normalizeCss, basicCss, appCss] = await Promise.all([
    readCss("styles/normalize.css"),
    readCss("styles/basic.css"),
    readCss("styles/app.css"),
  ]);
  const style = document.createElement("style");
  style.textContent = `${normalizeCss}\n${basicCss}\n${appCss}`;
  shadow.appendChild(style);

  // FAB
  const btn = document.createElement("button");
  btn.className = "fab";
  btn.setAttribute("aria-label", "Analyze this Upwork job page");
  btn.textContent = "Analyze";
  shadow.appendChild(btn);

  const toast = createToast(shadow);

  const fmtMoneyInt = (n) => (typeof n === "number" && !Number.isNaN(n) ? `$${n.toLocaleString()}` : "—");
  const fmtMoneyCur = (n, cur = "$") => (typeof n === "number" && !Number.isNaN(n) ? `${cur}${n.toFixed(2)}` : "—");

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.innerHTML = '<div class="spinner"></div>';

    try {
      const job = analyzeJob();
      const ai = AI_WORKS ? await analyzeViaServer(job) : null;

      const m = job.metrics || {};
      const fmtMoney2 = (n) => (typeof n === "number" && !Number.isNaN(n) ? `$${n.toFixed(2)}` : "—");

      const avgVal = typeof m.avgProjectValue === "number" ? fmtMoneyInt(m.avgProjectValue) : "—";
      const avgHr = typeof m.avgHourlyPaid === "number" ? `$${m.avgHourlyPaid}` : "—";
      const hrs = typeof m.totalHours === "number" ? m.totalHours.toLocaleString() : "—";
      const hireRate = m.hireRate != null ? m.hireRate + "%" : "—";

      const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

      const r = m.recentReviews || {};
      const cur = r.currency || "$";

      const content = ai?.html || `<p>${escapeHtml(ai?.text || "").replace(/\n/g, "<br>")}</p>`;
      const aiHtml =
        AI_WORKS && ai
          ? `
			<div class="ai-info">
				<p><b>AI analysis</b></p>
				${ai.html ? content : `<div>${content}</div>`}
			</div>`
          : "";

      const cx = m.connects || {};

      const applyLine =
        cx.required != null
          ? `${cx.required} Connects (~${fmtMoney2(cx.costUSD)})${cx.available != null ? ` · Available: ${cx.available}` : ""}`
          : "—";

      const html = `
        <div class="info">
          <div class="info-box">
            <p><b>Job Info</b></p>
            <p>Type: <b>${job.jobType ? cap(job.jobType) : "—"}</b></p>
            <p>Oriented price: <b>${job.budget?.label || "—"}</b></p>
			<p>Apply cost: <b>${applyLine}</b></p>
          </div>

          <div class="info-box">
            <p><b>Activity on this job</b></p>
            <p>Proposals: <b>${escapeHtml(job.proposals || "—")}</b></p>
            <p>Interviewing: <b>${m.interviewing ?? 0}</b></p>
            <p>Invites: <b>${m.invitesSent ?? 0}</b></p>
            <p>Unanswered: <b>${m.unansweredInvites ?? 0}</b></p>
            <p>Hired: <b>${m.hiresOnThisJob ?? 0}</b></p>
          </div>

          <div class="info-box">
            <p><b>About the client</b></p>
            <p>Verified: <b>${m.paymentVerified ? "Yes" : "No"}</b>${
              m.clientCountry ? " &nbsp;·&nbsp; Country: <b>" + escapeHtml(m.clientCountry) + "</b>" : ""
            }</p>
            <p>Spent: <b>${fmtMoneyInt(m.totalSpent)}</b></p>
            <p>Hired: <b>${m.hiresTotal}</b></p>
            <p>Avg project value: <b>${avgVal}</b></p>
            <p>Hire rate: <b>${hireRate}</b></p>
            <p>Avg hourly paid: <b>${avgHr}</b></p>
            <p>Hours: <b>${hrs}</b></p>
          </div>

          <div class="info-box">
            <p><b>Client's history</b></p>
            <p>From last <b>${r.count ?? 0}</b> jobs:</p>
            <p>Avg rating received: <b>${r.avgReceived ?? "—"}</b></p>
            <p>Avg rating given: <b>${r.avgGiven ?? "—"}</b></p>
            <p>Paid: <b>${fmtMoneyCur(r.totalPaid, cur)}</b></p>
          </div>

          ${aiHtml}
        </div>
      `;

      toast.show(html);
    } catch (e) {
      console.warn("[Analyze] error:", e);
      toast.show(`<p>Server error. Try again later.</p>`);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  console.log("[Analyze] button inserted");
}
