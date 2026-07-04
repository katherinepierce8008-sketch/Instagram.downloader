
function updateNeonClock() {
  const clockEl = document.getElementById('neonClock');
  if (!clockEl) return;

  const now = new Date();

  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const tehranOffset = 3.5 * 60 * 60 * 1000; // GMT+3:30
  const tehranTime = new Date(utc + tehranOffset);

  const h = String(tehranTime.getHours()).padStart(2, '0');
  const m = String(tehranTime.getMinutes()).padStart(2, '0');
  const s = String(tehranTime.getSeconds()).padStart(2, '0');

  const year = tehranTime.getFullYear();
  const month = String(tehranTime.getMonth() + 1).padStart(2, '0');
  const day = String(tehranTime.getDate()).padStart(2, '0');

  clockEl.textContent = `تهران ${year}/${month}/${day}  ${h}:${m}:${s}`;
}

setInterval(updateNeonClock, 1000);
updateNeonClock();

