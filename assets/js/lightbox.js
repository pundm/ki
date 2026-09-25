(() => {
  "use strict";

  const box = document.getElementById("lightbox");
  const dialog = box?.querySelector(".lightbox-dialog");
  const image = document.getElementById("lightbox-image");
  const status = document.getElementById("lightbox-status");
  if (!box || !dialog || !image) return;

  let lastTrigger = null;
  let candidates = [];
  let candidateIndex = 0;

  function close() {
    box.hidden = true;
    box.setAttribute("aria-hidden", "true");
    image.removeAttribute("src");
    image.alt = "";
    status.hidden = true;
    candidates = [];
    candidateIndex = 0;
    if (lastTrigger) lastTrigger.focus();
  }

  function showCandidate() {
    if (candidateIndex >= candidates.length) {
      image.removeAttribute("src");
      status.textContent = "Screenshot image not found. Copy the original screens folder into static/screens/.";
      status.hidden = false;
      return;
    }
    status.hidden = true;
    image.src = candidates[candidateIndex++];
  }

  image.addEventListener("error", showCandidate);

  function open(trigger) {
    lastTrigger = trigger;
    const id = trigger.dataset.screenshotId;
    const half = trigger.dataset.half;
    const map = trigger.dataset.map || "match screenshot";
    image.alt = map;

    // The original PHP endpoint supplied dimensions but not filenames.
    // Try common local naming conventions so the site works with most exported screen folders.
    const base = "screens/";
    const exts = ["png", "jpg", "jpeg", "gif", "webp"];
    candidates = [];
    for (const ext of exts) {
      candidates.push(`${base}${id}_${half}.${ext}`);
      candidates.push(`${base}${id}-${half}.${ext}`);
      candidates.push(`${base}${id}.${half}.${ext}`);
      candidates.push(`${base}${id}/${half}.${ext}`);
    }
    for (const ext of exts) candidates.push(`${base}${id}.${ext}`);

    candidateIndex = 0;
    box.hidden = false;
    box.setAttribute("aria-hidden", "false");
    showCandidate();
    dialog.focus();
  }

  document.querySelectorAll(".screenshot-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => open(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(trigger);
      }
    });
  });

  box.addEventListener("click", (event) => {
    if (event.target.matches("[data-close]")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (box.hidden) return;
    if (event.key === "Escape") close();
  });
})();
