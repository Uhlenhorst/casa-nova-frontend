// Lädt Mittagstisch und/oder Spezialkarte aus dem Backend
// und rendert sie in die jeweilige Seite.

async function ladeMittagstisch() {
  const ziel = document.getElementById("mittagstisch-inhalt");
  if (!ziel) return;

  try {
    const res = await fetch(`${API_BASE}/api/mittagstisch`);
    if (!res.ok) throw new Error("Antwort nicht ok");
    const data = await res.json();

    ziel.innerHTML = data.days.map(day => `
      <div class="day-card">
        <h3>${day.tag} <span class="small">${day.datum}</span></h3>
        <ul>
          ${day.gerichte.map(g => `
            <li><span>${g.name}</span><span class="preis">${g.preis}</span></li>
          `).join("")}
        </ul>
      </div>
    `).join("");
  } catch (err) {
    ziel.innerHTML = `<p class="msg error">Der Mittagstisch konnte gerade nicht geladen werden. Bitte später erneut versuchen.</p>`;
    console.error(err);
  }
}

async function ladeSpezialkarte() {
  const ziel = document.getElementById("spezialkarte-inhalt");
  if (!ziel) return;

  try {
    const res = await fetch(`${API_BASE}/api/spezialkarte`);
    if (!res.ok) throw new Error("Antwort nicht ok");
    const data = await res.json();

    const belegt = data.gerichte.filter(g => g.name && g.name.trim() !== "");

    if (belegt.length === 0) {
      ziel.innerHTML = `<p class="small">Aktuell keine Spezialgerichte hinterlegt – schaut bald wieder vorbei.</p>`;
      return;
    }

    ziel.innerHTML = `<ul class="spezial-list">` + belegt.map(g => `
      <li class="spezial-card">
        <h3><span class="spezial-code">${g.code}</span>${g.name}</h3>
        ${g.beschreibung ? `<p>${g.beschreibung}</p>` : ""}
        <p class="preis">${g.preis}</p>
      </li>
    `).join("") + `</ul>`;
  } catch (err) {
    ziel.innerHTML = `<p class="msg error">Die Spezialkarte konnte gerade nicht geladen werden. Bitte später erneut versuchen.</p>`;
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ladeMittagstisch();
  ladeSpezialkarte();
});
