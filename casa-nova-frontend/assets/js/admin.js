// Gemeinsame Logik fürs Backoffice: Login, Token-Verwaltung, Editor-Formulare.

const TOKEN_KEY = "casaNovaAdminToken";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function zeigeMeldung(zielId, text, typ = "error") {
  const ziel = document.getElementById(zielId);
  if (!ziel) return;
  ziel.innerHTML = `<div class="msg ${typ}">${text}</div>`;
}

// --- Login-Seite ---

const loginForm = document.getElementById("login-form");
if (loginForm) {
  // Falls schon eingeloggt, direkt zum Dashboard
  if (getToken()) {
    window.location.href = "dashboard.html";
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        zeigeMeldung("login-message", data.error || "Login fehlgeschlagen.", "error");
        return;
      }

      setToken(data.token);
      window.location.href = "dashboard.html";
    } catch (err) {
      zeigeMeldung("login-message", "Server nicht erreichbar. Bitte später erneut versuchen.", "error");
      console.error(err);
    }
  });
}

// --- Dashboard-Seite ---

const dashboard = document.getElementById("mittagstisch-editor");
if (dashboard) {
  if (!getToken()) {
    window.location.href = "login.html";
  }

  document.getElementById("logout-btn").addEventListener("click", () => {
    clearToken();
    window.location.href = "login.html";
  });

  async function ladeUndZeichneMittagstisch() {
    const res = await fetch(`${API_BASE}/api/mittagstisch`);
    const data = await res.json();
    const editor = document.getElementById("mittagstisch-editor");

    editor.innerHTML = data.days.map((day, dIdx) => `
      <div class="day-edit" data-tag="${day.tag}" data-datum="${day.datum}">
        <h3>${day.tag} <span class="small">${day.datum}</span></h3>
        ${day.gerichte.map((g, gIdx) => `
          <div class="item-row">
            <div>
              <label>Gericht ${gIdx + 1}</label>
              <input type="text" data-day="${dIdx}" data-item="${gIdx}" data-field="name" value="${escapeHtml(g.name)}">
            </div>
            <div>
              <label>Preis</label>
              <input type="text" data-day="${dIdx}" data-item="${gIdx}" data-field="preis" value="${escapeHtml(g.preis)}">
            </div>
          </div>
        `).join("")}
      </div>
    `).join("");

    editor.dataset.raw = JSON.stringify(data);
  }

  async function ladeUndZeichneSpezialkarte() {
    const res = await fetch(`${API_BASE}/api/spezialkarte`);
    const data = await res.json();
    const editor = document.getElementById("spezialkarte-editor");

    editor.innerHTML = `
      <div class="spezial-row"><strong>Code</strong><strong>Name</strong><strong>Beschreibung</strong><strong>Preis</strong></div>
      ` + data.gerichte.map((g, idx) => `
        <div class="spezial-row">
          <input type="text" value="${g.code}" disabled>
          <input type="text" data-spezial="${idx}" data-field="name" value="${escapeHtml(g.name)}" placeholder="z. B. Vitello Tonnato">
          <input type="text" data-spezial="${idx}" data-field="beschreibung" value="${escapeHtml(g.beschreibung)}" placeholder="kurze Beschreibung">
          <input type="text" data-spezial="${idx}" data-field="preis" value="${escapeHtml(g.preis)}" placeholder="€ 0,00">
        </div>
      `).join("");

    editor.dataset.raw = JSON.stringify(data);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  document.getElementById("save-mittagstisch").addEventListener("click", async () => {
    const editor = document.getElementById("mittagstisch-editor");
    const data = JSON.parse(editor.dataset.raw);

    editor.querySelectorAll("input").forEach(input => {
      const dIdx = input.dataset.day;
      const gIdx = input.dataset.item;
      const field = input.dataset.field;
      if (dIdx === undefined || gIdx === undefined) return;
      data.days[dIdx].gerichte[gIdx][field] = input.value;
    });

    await speichern("/api/mittagstisch", data, "dashboard-message", "Mittagstisch gespeichert.");
  });

  document.getElementById("save-spezialkarte").addEventListener("click", async () => {
    const editor = document.getElementById("spezialkarte-editor");
    const data = JSON.parse(editor.dataset.raw);

    editor.querySelectorAll("input[data-spezial]").forEach(input => {
      const idx = input.dataset.spezial;
      const field = input.dataset.field;
      data.gerichte[idx][field] = input.value;
    });

    await speichern("/api/spezialkarte", data, "dashboard-message", "Spezialkarte gespeichert.");
  });

  async function speichern(pfad, data, meldungsId, erfolgsText) {
    try {
      const res = await fetch(`${API_BASE}${pfad}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });

      if (res.status === 401 || res.status === 403) {
        clearToken();
        window.location.href = "login.html";
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        zeigeMeldung(meldungsId, result.error || "Speichern fehlgeschlagen.", "error");
        return;
      }

      zeigeMeldung(meldungsId, erfolgsText, "success");
    } catch (err) {
      zeigeMeldung(meldungsId, "Server nicht erreichbar. Bitte später erneut versuchen.", "error");
      console.error(err);
    }
  }

  ladeUndZeichneMittagstisch();
  ladeUndZeichneSpezialkarte();
}
