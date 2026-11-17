const $ = (id) => document.getElementById(id);

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "—";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

async function refreshDashboard() {
  try {
    const healthResponse = await fetch("/health", { cache: "no-store" });
    const health = await healthResponse.json();
    const healthy = healthResponse.ok && health.status === "healthy";

    $("app-status").textContent = healthy ? "Healthy" : "Unhealthy";
    $("app-status").style.color = healthy ? "var(--green)" : "var(--red)";
    $("status-detail").textContent = healthy ? "Health endpoint responding" : "Health check returned an error";
    $("status-indicator").style.background = healthy ? "var(--green)" : "var(--red)";
    $("flask-state").innerHTML = healthy ? "<i></i> Healthy" : "<i></i> Unhealthy";
    $("flask-state").classList.toggle("down", !healthy);

    const metricsResponse = await fetch("/metrics", { cache: "no-store" });
    const metricsText = await metricsResponse.text();
    const uptimeMatch = metricsText.match(/^sentinel_app_uptime_seconds\s+([\d.]+)/m);
    const requestMatch = metricsText.match(/^sentinel_http_requests_total\s+([\d.]+)/m);

    if (uptimeMatch) {
      const seconds = Number(uptimeMatch[1]);
      $("uptime").textContent = formatDuration(seconds);
      $("chart-uptime").textContent = formatDuration(seconds);
    }
    if (requestMatch) $("requests").textContent = Math.round(Number(requestMatch[1])).toLocaleString();
    $("last-updated").textContent = `Last check: ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    $("app-status").textContent = "Offline";
    $("app-status").style.color = "var(--red)";
    $("status-detail").textContent = "Unable to reach Flask application";
    $("flask-state").innerHTML = "<i></i> Offline";
    $("flask-state").classList.add("down");
    $("last-updated").textContent = "Connection failed";
  }
}

async function runAction(path, message) {
  const feedback = $("action-feedback");
  const buttons = document.querySelectorAll(".action-button");
  buttons.forEach((button) => button.disabled = true);
  feedback.className = "action-feedback";
  feedback.textContent = message;

  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const result = await response.json();
    feedback.className = "action-feedback success";
    feedback.textContent = result.message || "Action completed.";
    setTimeout(refreshDashboard, 500);
  } catch (error) {
    feedback.className = "action-feedback error";
    feedback.textContent = `Could not complete action: ${error.message}`;
  } finally {
    buttons.forEach((button) => button.disabled = false);
  }
}

$("unhealthy-btn").addEventListener("click", () =>
  runAction("/simulate-unhealthy", "Sending unhealthy-state simulation…")
);
$("restore-btn").addEventListener("click", () =>
  runAction("/restore-health", "Restoring application health…")
);
$("crash-btn").addEventListener("click", () => {
  const confirmed = window.confirm(
    "This will terminate the Flask process. Docker should restart the container. Continue?"
  );
  if (confirmed) {
    $("action-feedback").textContent = "Crash simulation sent. The page may briefly become unavailable while Docker restarts the container.";
    fetch("/simulate-crash").catch(() => {});
  }
});

// Workspace navigation active state
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

refreshDashboard();
setInterval(refreshDashboard, 5000);
