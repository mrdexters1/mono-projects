import { analyzeJob } from "./jobAnalysis.js";

const API_MATCH = "https://freelanceai.tech/api/match";
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

// toast (persistent with close; optional timeout)
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
        <strong>Analysis</strong>
        <button class="toast-close" aria-label="Close">×</button>
      </div>
      <div class="toast-body">${html}</div>
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
      const disarm = () => clearTimeout(timer);
      arm();
      el.addEventListener("mouseenter", disarm);
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

  const readCss = async (path) => (await fetch(chrome.runtime.getURL(path))).text().catch(() => "");
  const [normalizeCss, basicCss, appCss] = await Promise.all([
    readCss("styles/normalize.css"),
    readCss("styles/basic.css"),
    readCss("styles/app.css"),
  ]);
  const style = document.createElement("style");
  style.textContent = `${normalizeCss}\n${basicCss}\n${appCss}`;
  shadow.appendChild(style);

  const btn = document.createElement("button");
  btn.className = "fab";
  btn.setAttribute("aria-label", "Analyze this Upwork job page");
  btn.textContent = "Analyze";
  shadow.appendChild(btn);

  const toast = createToast(shadow);

  btn.addEventListener("click", async () => {
    try {
      const job = analyzeJob();
      const ai = await analyzeViaServer(job);

      const m = job.metrics || {};
      const fmtMoney = (n) => (typeof n === "number" && !Number.isNaN(n) ? `$${n.toLocaleString()}` : "—");
      const avgVal = typeof m.avgProjectValue === "number" ? fmtMoney(m.avgProjectValue) : "—";
      const avgHr = typeof m.avgHourlyPaid === "number" ? `$${m.avgHourlyPaid}` : "—";
      const hrs = typeof m.totalHours === "number" ? m.totalHours.toLocaleString() : "—";
      const hireRate = m.hireRate != null ? m.hireRate + "%" : "—";

      const scorePct = Math.round((ai?.score || 0) * 100);

      const html = `
		  <div class="info">
			<div class="info-box">
			  <p><b>AI analysis</b></p>
			  <p>Reply success: <b>${scorePct}%</b></p>
			  ${
          Array.isArray(ai?.explanations) && ai.explanations.length
            ? `<p>Why:</p><ul>${ai.explanations
                .slice(0, 3)
                .map((s) => `<li>${escapeHtml(s)}</li>`)
                .join("")}</ul>`
            : ""
        }
			  ${
          Array.isArray(ai?.tips) && ai.tips.length
            ? `<p>Tips:</p><ul>${ai.tips
                .slice(0, 4)
                .map((s) => `<li>${escapeHtml(s)}</li>`)
                .join("")}</ul>`
            : ""
        }
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
			  <p>Verified: <b>${m.paymentVerified ? "Yes" : "No"}</b>${m.clientCountry ? " · Country: <b>" + escapeHtml(m.clientCountry) + "</b>" : ""}</p>
			  <p>Spent: <b>${fmtMoney(m.totalSpent)}</b></p>
			  <p>Jobs posted: <b>${m.jobsPosted ?? "—"}</b></p>
			  <p>Hire rate: <b>${hireRate}</b></p>
			  <p>Avg project value: <b>${avgVal}</b></p>
			  <p>Avg hourly paid: <b>${avgHr}</b> × Hours: <b>${hrs}</b></p>
			</div>
  
			<div class="info-box">
			  <p><b>Client's recent history</b></p>
			  <p>${m.reviews?.count ? "Recent reviews ≥4.5★: <b>" + m.reviews.positive + "/" + m.reviews.count + "</b>" : "—"}</p>
			</div>
		  </div>
		`;

      toast.show(html);
    } catch (e) {
      console.warn("[Analyze] error:", e);
      toast.show(`<p>Server error. Try again later.</p>`);
    }
  });

  console.log("[Analyze] button inserted");
}
