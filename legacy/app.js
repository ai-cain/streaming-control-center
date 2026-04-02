const DEFAULTS = {
  apiBase: "http://181.233.26.102:7000",
  mediaBase: "http://181.233.26.102:8000",
  app: "almaperu",
  key: "test_cam",
};

const PAGE_LABELS = {
  live: "Live monitor listo",
  playback: "Playback historico listo",
  export: "Export manager listo",
  snapshot: "Snapshot inspector listo",
  config: "Config y endpoints listos",
};

const state = {
  hlsLive: null,
  hlsPlayback: null,
  workers: "-",
  activeCameras: "-",
  lastSync: "-",
  pageContext: PAGE_LABELS.live,
};

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function normalizeBaseUrl(value, fallback = "") {
  let raw = (value || fallback).trim();
  if (!raw) return "";
  if (!/^https?:\/\//i.test(raw)) raw = `http://${raw}`;
  return raw.replace(/\/+$/, "");
}

function joinUrl(base, path) {
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function cfg() {
  return {
    apiBase: normalizeBaseUrl($("api-base").value, DEFAULTS.apiBase),
    mediaBase: normalizeBaseUrl($("media-base").value, DEFAULTS.mediaBase),
    app: $("nms-app").value.trim() || DEFAULTS.app,
    key: $("stream-key").value.trim() || DEFAULTS.key,
  };
}

function apiBase() {
  return cfg().apiBase;
}

function mediaBase() {
  return cfg().mediaBase;
}

function safeOrigin() {
  return window.location.origin === "null" ? "file:// (sin origin http)" : window.location.origin;
}

function hostnameFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function isIpAddress(hostname) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

function isPrivateIp(hostname) {
  if (!isIpAddress(hostname)) return false;
  const [a, b] = hostname.split(".").map(Number);
  return (
    a === 10 ||
    a === 127 ||
    (a === 192 && b === 168) ||
    (a === 172 && b >= 16 && b <= 31)
  );
}

function isPublicIp(hostname) {
  return isIpAddress(hostname) && !isPrivateIp(hostname);
}

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function usesInsecureHttp(base) {
  return /^http:\/\//i.test(base);
}

function describeConnectionMode() {
  const current = cfg();
  const apiHost = hostnameFromUrl(current.apiBase);
  const mediaHost = hostnameFromUrl(current.mediaBase);
  const httpsPage = window.location.protocol === "https:";

  if (httpsPage && (usesInsecureHttp(current.apiBase) || usesInsecureHttp(current.mediaBase))) {
    return {
      mode: "mixed content",
      note: "La UI corre en HTTPS pero los endpoints estan en HTTP. El navegador puede bloquear fetch, video o snapshots.",
    };
  }

  if (isLocalHost(apiHost) && isLocalHost(mediaHost)) {
    return {
      mode: "solo local",
      note: "Los endpoints apuntan a localhost. Solo la misma maquina puede llegar, salvo que publiques otro proxy.",
    };
  }

  if (isPrivateIp(apiHost) || isPrivateIp(mediaHost)) {
    return {
      mode: "lan privada",
      note: "Estas usando una IP privada. Solo clientes de la misma LAN o VPN podran entrar, salvo que publiques puertos hacia internet.",
    };
  }

  if (isPublicIp(apiHost) || isPublicIp(mediaHost)) {
    return {
      mode: "publico",
      note: "Estas apuntando a IP publica. Si los puertos estan abiertos y no hay auth, cualquiera con acceso de red puede consumir estos endpoints.",
    };
  }

  return {
    mode: "custom",
    note: "Verifica reachability, firewall y CORS segun tu arquitectura actual.",
  };
}

function setHealthState(status, text) {
  $("health-dot").className = `status-dot ${status}`;
  $("health-txt").textContent = text;
}

function setLastSync(context) {
  state.lastSync = new Date().toLocaleTimeString();
  if (context) state.pageContext = context;
  $("hero-last-sync").textContent = state.lastSync;
  $("hero-page-context").textContent = state.pageContext;
}

function updateWorkerSummary(workers = state.workers, activeCameras = state.activeCameras) {
  state.workers = workers;
  state.activeCameras = activeCameras;
  $("hero-workers").textContent = workers === "-" ? "-" : String(workers);
  $("hero-cameras").textContent = activeCameras === "-" ? "Sin datos aun" : `${activeCameras} camaras grabando`;
}

function renderConnectionSummary() {
  const current = cfg();
  const modeInfo = describeConnectionMode();
  const liveUrl = joinUrl(current.mediaBase, `${current.app}/${current.key}/index.m3u8`);

  $("connection-mode").textContent = modeInfo.mode;
  $("hero-endpoint").textContent = current.apiBase;
  $("hero-warning").textContent = modeInfo.note;
  $("hero-stream").textContent = `${current.app}/${current.key}`;
  $("hero-live-origin").textContent = liveUrl;
  $("live-origin-label").textContent = current.mediaBase;

  $("live-request").textContent = liveUrl;
  $("status-request").textContent = joinUrl(current.apiBase, "/api/recording/status");
  $("playback-request").textContent = joinUrl(current.apiBase, "/api/recording/playback?camera={id}&from={YYYY-MM-DD HH:mm:ss}&to={YYYY-MM-DD HH:mm:ss}");
  $("available-request").textContent = joinUrl(current.apiBase, "/api/recording/playback/available?camera={id}&date={YYYY-MM-DD}");
  $("export-create-request").textContent = joinUrl(current.apiBase, "/api/recording/export");
  $("exports-request").textContent = joinUrl(current.apiBase, "/api/recording/export");
  $("snapshot-request").textContent = joinUrl(current.apiBase, "/api/recording/snapshot/{camera}/latest");
  $("snapshot-history-request").textContent = joinUrl(current.apiBase, "/api/recording/snapshot/{camera}/history?limit=5");
  $("snapshot-image-request").textContent = joinUrl(current.mediaBase, "/storage{relative_path}");

  $("cfg-api").textContent = current.apiBase;
  $("cfg-media").textContent = current.mediaBase;
  $("cfg-live").textContent = liveUrl;
  $("cfg-origin").textContent = safeOrigin();
  $("cfg-mode").textContent = modeInfo.mode;
  $("cfg-note").textContent = modeInfo.note;

  $("map-health").textContent = joinUrl(current.apiBase, "/api/recording/health");
  $("map-status").textContent = joinUrl(current.apiBase, "/api/recording/status");
  $("map-playback").textContent = joinUrl(current.apiBase, "/api/recording/playback?camera={id}&from={YYYY-MM-DD HH:mm:ss}&to={YYYY-MM-DD HH:mm:ss}");
  $("map-available").textContent = joinUrl(current.apiBase, "/api/recording/playback/available?camera={id}&date={YYYY-MM-DD}");
  $("map-export-create").textContent = joinUrl(current.apiBase, "/api/recording/export");
  $("map-exports").textContent = joinUrl(current.apiBase, "/api/recording/export");
  $("map-snapshot-latest").textContent = joinUrl(current.apiBase, "/api/recording/snapshot/{camera}/latest");
  $("map-snapshot-history").textContent = joinUrl(current.apiBase, "/api/recording/snapshot/{camera}/history?limit=5");
}

function saveConfig() {
  const current = cfg();
  localStorage.setItem("recorder_api_base", current.apiBase);
  localStorage.setItem("recorder_media_base", current.mediaBase);
  localStorage.setItem("recorder_app", current.app);
  localStorage.setItem("recorder_key", current.key);
  renderConnectionSummary();
}

function loadSavedConfig() {
  const savedApiBase = localStorage.getItem("recorder_api_base");
  const savedMediaBase = localStorage.getItem("recorder_media_base");
  const savedApp = localStorage.getItem("recorder_app");
  const savedKey = localStorage.getItem("recorder_key");
  const legacyIp = localStorage.getItem("recorder_ip");

  if (savedApiBase) $("api-base").value = savedApiBase;
  else if (legacyIp) $("api-base").value = `http://${legacyIp}:7000`;

  if (savedMediaBase) $("media-base").value = savedMediaBase;
  else if (legacyIp) $("media-base").value = `http://${legacyIp}:8000`;

  if (savedApp) $("nms-app").value = savedApp;
  if (savedKey) $("stream-key").value = savedKey;
}

function applyConfig() {
  saveConfig();
  loadLive();
  fetchStatus();
  checkHealth();
  log("Configuracion aplicada y endpoints actualizados.");
}

function clearLog() {
  $("log").innerHTML = "";
  log("Log limpiado.");
}

function log(message, type = "info") {
  const row = document.createElement("div");
  row.className = `log-entry ${type}`;
  row.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  $("log").appendChild(row);
  $("log").scrollTop = $("log").scrollHeight;
}

function safePlay(video) {
  const attempt = video.play();
  if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
}

function fmtDatetime(value) {
  if (!value) return "";
  return `${value.replace("T", " ")}:00`;
}

function toLocalInputValue(date) {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 16);
}

function toLocalDateValue(date) {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 10);
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function formatSnapshotMeta(data) {
  return [
    data.taken_at ? `Capturado: ${data.taken_at}` : null,
    data.width_px && data.height_px ? `${data.width_px}x${data.height_px}` : null,
    data.file_size_bytes ? `${Math.round(data.file_size_bytes / 1024)} KB` : null,
  ].filter(Boolean).join(" | ");
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }

  if (!response.ok) {
    throw new Error(data.detail || `HTTP ${response.status}`);
  }

  return data;
}

function renderStatusCard(camera) {
  const cameraKey = escapeHtml(camera.camera_key || `cam_${camera.id_Camera || "-"}`);
  const heartbeat = escapeHtml(camera.last_heartbeat || "-");
  const isRunning = Boolean(camera.is_running);

  return `
    <article class="status-card">
      <div class="status-card-top">
        <strong>${cameraKey}</strong>
        <span class="badge ${isRunning ? "recording" : "stopped"}">${isRunning ? "grabando" : "detenido"}</span>
      </div>
      <div class="status-card-meta">
        <span>heartbeat</span>
        <code>${heartbeat}</code>
      </div>
    </article>
  `;
}

function renderExportJob(job) {
  const jobId = escapeHtml(job.id || "-");
  const cameraId = escapeHtml(job.id_Camera || job.camera_id || "-");
  const status = escapeHtml(job.status || "unknown");
  const startAt = escapeHtml(job.startAt || job.from_time || "-");
  const endAt = escapeHtml(job.endAt || job.to_time || "-");
  const downloadUrl = joinUrl(apiBase(), `/api/recording/export/${job.id}/download`);

  return `
    <article class="job-card">
      <div class="job-card-top">
        <strong>#${jobId} | cam ${cameraId}</strong>
        <span class="badge ${status}">${status}</span>
      </div>
      <p>${startAt} -> ${endAt}</p>
      ${job.outputFilePath ? `<a class="download-link" href="${downloadUrl}">Descargar MP4</a>` : ""}
    </article>
  `;
}

function applyQuickRange(prefix, minutes) {
  const now = new Date();
  const from = new Date(now.getTime() - minutes * 60000);
  $(`${prefix}-from`).value = toLocalInputValue(from);
  $(`${prefix}-to`).value = toLocalInputValue(now);
}

function setDefaultRanges() {
  applyQuickRange("pb", 60);
  applyQuickRange("exp", 60);
}

function attachTabHandlers() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
      button.classList.add("active");
      $("page-" + button.dataset.tab).classList.add("active");
      state.pageContext = PAGE_LABELS[button.dataset.tab] || "Panel activo";
      $("hero-page-context").textContent = state.pageContext;
    });
  });
}

function attachActionHandlers() {
  $("btn-live-reload").addEventListener("click", loadLive);
  $("btn-status-refresh").addEventListener("click", fetchStatus);
  $("btn-clear-log").addEventListener("click", clearLog);
  $("btn-playback-load").addEventListener("click", loadPlayback);
  $("btn-available").addEventListener("click", fetchAvailable);
  $("btn-export-create").addEventListener("click", createExport);
  $("btn-exports-refresh").addEventListener("click", fetchExports);
  $("btn-snapshot-latest").addEventListener("click", fetchSnapshot);
  $("btn-snapshot-history").addEventListener("click", fetchSnapshotHistory);
  $("btn-apply-config").addEventListener("click", applyConfig);

  document.querySelectorAll(".chip-button").forEach((button) => {
    button.addEventListener("click", () => {
      applyQuickRange(button.dataset.rangeTarget, Number(button.dataset.minutes));
      log(`Rango rapido aplicado: ultimos ${button.dataset.minutes} min.`);
    });
  });

  ["api-base", "media-base", "nms-app", "stream-key"].forEach((id) => {
    $(id).addEventListener("input", renderConnectionSummary);
  });
}

async function checkHealth() {
  try {
    const data = await fetchJson(joinUrl(apiBase(), "/api/recording/health"));
    setHealthState("ok", `Recorder ok | workers: ${data.workers}`);
    updateWorkerSummary(data.workers, state.activeCameras);
    setLastSync("Health actualizado");
  } catch {
    setHealthState("err", "Recorder sin conexion");
  }
}

function destroyHlsPlayer(name) {
  if (state[name]) {
    state[name].destroy();
    state[name] = null;
  }
}

function loadLive() {
  const current = cfg();
  const url = joinUrl(current.mediaBase, `${current.app}/${current.key}/index.m3u8`);
  const video = $("video-live");

  $("live-request").textContent = url;
  $("live-url").textContent = url;
  $("hero-live-origin").textContent = url;

  destroyHlsPlayer("hlsLive");

  if (window.Hls && Hls.isSupported()) {
    state.hlsLive = new Hls({ liveSyncDurationCount: 3 });
    state.hlsLive.loadSource(url);
    state.hlsLive.attachMedia(video);
    state.hlsLive.on(Hls.Events.MANIFEST_PARSED, () => {
      safePlay(video);
      log(`Live cargado: ${url}`);
      setLastSync("Live actualizado");
    });
    state.hlsLive.on(Hls.Events.ERROR, (_event, details) => {
      if (details.fatal) log(`HLS live error: ${details.details}`, "err");
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    safePlay(video);
    log(`Live cargado con soporte nativo: ${url}`);
  } else {
    log("HLS no soportado en este browser.", "err");
  }
}

async function fetchStatus() {
  const requestUrl = joinUrl(apiBase(), "/api/recording/status");
  $("status-request").textContent = requestUrl;

  try {
    const data = await fetchJson(requestUrl);
    const cameras = Array.isArray(data) ? data : [];
    const active = cameras.filter((cam) => cam.is_running).length;

    updateWorkerSummary(state.workers, active);

    if (!cameras.length) {
      $("status-container").innerHTML = '<p class="empty">Sin camaras activas.</p>';
      setLastSync("Estado de grabacion actualizado");
      return;
    }

    $("status-container").innerHTML = cameras.map(renderStatusCard).join("");
    setLastSync("Estado de grabacion actualizado");
  } catch (error) {
    $("status-container").innerHTML = '<p class="empty">No se pudo cargar el estado.</p>';
    log(`Error status: ${error.message}`, "err");
  }
}

async function loadPlayback() {
  const camera = $("pb-camera").value;
  const fromInput = $("pb-from").value;
  const toInput = $("pb-to").value;

  if (!fromInput || !toInput) {
    log("Selecciona fecha desde y hasta para playback.", "warn");
    return;
  }

  const requestUrl = joinUrl(
    apiBase(),
    `/api/recording/playback?camera=${encodeURIComponent(camera)}&from=${encodeURIComponent(fmtDatetime(fromInput))}&to=${encodeURIComponent(fmtDatetime(toInput))}`,
  );

  $("playback-request").textContent = requestUrl;

  try {
    const data = await fetchJson(requestUrl);
    if (!data.playlist_url) throw new Error("El recorder no devolvio playlist_url.");

    const m3u8Url = joinUrl(apiBase(), data.playlist_url);
    const video = $("video-playback");

    $("playback-url").textContent = m3u8Url;
    $("pb-info").textContent = `Segmentos: ${data.segments_count} | Duracion: ${formatDuration(data.total_duration_seconds)}`;

    destroyHlsPlayer("hlsPlayback");

    if (window.Hls && Hls.isSupported()) {
      state.hlsPlayback = new Hls();
      state.hlsPlayback.loadSource(m3u8Url);
      state.hlsPlayback.attachMedia(video);
      state.hlsPlayback.on(Hls.Events.MANIFEST_PARSED, () => safePlay(video));
      state.hlsPlayback.on(Hls.Events.ERROR, (_event, details) => {
        if (details.fatal) log(`HLS playback error: ${details.details}`, "err");
      });
    } else {
      video.src = m3u8Url;
      safePlay(video);
    }

    log(`Playback listo para cam ${camera}: ${data.segments_count} segmentos, ${formatDuration(data.total_duration_seconds)}.`);
    setLastSync("Playback consultado");
  } catch (error) {
    log(`Error playback: ${error.message}`, "err");
  }
}

async function fetchAvailable() {
  const requestUrl = joinUrl(
    apiBase(),
    `/api/recording/playback/available?camera=${encodeURIComponent($("pb-camera").value)}&date=${toLocalDateValue(new Date())}`,
  );

  $("available-request").textContent = requestUrl;

  try {
    const data = await fetchJson(requestUrl);
    const hours = Array.isArray(data.available_hours) ? data.available_hours : [];
    $("available-info").textContent = hours.length
      ? `Horas con grabacion hoy: ${hours.map((hour) => `${String(hour).padStart(2, "0")}:00`).join("  ")}`
      : "Sin grabacion disponible hoy.";
    setLastSync("Disponibilidad consultada");
  } catch (error) {
    log(`Error disponibilidad: ${error.message}`, "err");
  }
}

async function createExport() {
  const fromInput = $("exp-from").value;
  const toInput = $("exp-to").value;
  const requestUrl = joinUrl(apiBase(), "/api/recording/export");

  $("export-create-request").textContent = requestUrl;

  if (!fromInput || !toInput) {
    log("Selecciona un rango valido para exportar.", "warn");
    return;
  }

  try {
    const data = await fetchJson(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        camera_id: Number($("exp-camera").value),
        from_time: fmtDatetime(fromInput),
        to_time: fmtDatetime(toInput),
      }),
    });

    $("exp-result").innerHTML = `Job creado <strong>#${escapeHtml(data.job_id)}</strong> con estado <span class="badge pending">${escapeHtml(data.status || "pending")}</span>`;
    log(`Export job #${data.job_id} creado.`);
    setLastSync("Export job creado");
    fetchExports();
  } catch (error) {
    log(`Error export: ${error.message}`, "err");
  }
}

async function fetchExports() {
  const requestUrl = joinUrl(apiBase(), "/api/recording/export");
  $("exports-request").textContent = requestUrl;

  try {
    const data = await fetchJson(requestUrl);
    const jobs = Array.isArray(data) ? data : [];
    $("exports-list").innerHTML = jobs.length
      ? jobs.slice(0, 10).map(renderExportJob).join("")
      : '<p class="empty">Sin jobs disponibles.</p>';
    setLastSync("Jobs de exportacion actualizados");
  } catch (error) {
    log(`Error exports: ${error.message}`, "err");
  }
}

async function fetchSnapshot() {
  const camera = $("snap-camera").value;
  const requestUrl = joinUrl(apiBase(), `/api/recording/snapshot/${encodeURIComponent(camera)}/latest`);
  $("snapshot-request").textContent = requestUrl;

  try {
    const data = await fetchJson(requestUrl);
    const imageUrl = joinUrl(mediaBase(), `/storage${data.relative_path}`);
    $("snapshot-image-request").textContent = imageUrl;
    $("snapshot-img").src = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
    $("snapshot-info").textContent = formatSnapshotMeta(data) || "Snapshot recibido.";
    log(`Snapshot consultado para cam ${camera}.`);
    setLastSync("Snapshot actualizado");
  } catch (error) {
    log(`Error snapshot: ${error.message}`, "err");
  }
}

async function fetchSnapshotHistory() {
  const camera = $("snap-camera").value;
  const requestUrl = joinUrl(apiBase(), `/api/recording/snapshot/${encodeURIComponent(camera)}/history?limit=5`);
  $("snapshot-history-request").textContent = requestUrl;

  try {
    const data = await fetchJson(requestUrl);
    const snapshots = Array.isArray(data.snapshots) ? data.snapshots : [];
    $("snap-history").innerHTML = snapshots.length
      ? snapshots.map((snapshot) => escapeHtml(snapshot.taken_at || "-")).join("<br>")
      : "Sin historial disponible.";
    setLastSync("Historial de snapshots actualizado");
  } catch (error) {
    log(`Error historial snapshot: ${error.message}`, "err");
  }
}

function initUi() {
  loadSavedConfig();
  attachTabHandlers();
  attachActionHandlers();
  setDefaultRanges();
  renderConnectionSummary();
  saveConfig();
  loadLive();
  fetchStatus();
  checkHealth();
  log("UI iniciada.");

  setInterval(fetchStatus, 10000);
  setInterval(checkHealth, 5000);
}

window.addEventListener("load", initUi);
