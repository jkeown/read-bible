document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = Array.from(
    document.querySelectorAll('input[type="checkbox"][data-chapter]'),
  );
  const storageKey = "bibleReadingProgress";

  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  checkboxes.forEach((cb) => {
    if (saved[cb.dataset.chapter]) cb.checked = true;
  });

  function saveProgress() {
    checkboxes.forEach((cb) => {
      saved[cb.dataset.chapter] = cb.checked;
    });
    localStorage.setItem(storageKey, JSON.stringify(saved));
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      saveProgress();
      renderNextUp();
    });
  });

  // Reset button
  const resetBtn = document.getElementById("reset-progress");
  resetBtn.addEventListener("click", () => {
    checkboxes.forEach((cb) => (cb.checked = false));
    localStorage.removeItem(storageKey);
    Object.keys(saved).forEach((key) => delete saved[key]);
    renderNextUp();
  });

  // Toggle full list
  const toggleBtn = document.getElementById("toggle-list");
  const fullList = document.getElementById("full-list");
  toggleBtn.addEventListener("click", () => {
    const isHidden = fullList.hasAttribute("hidden");
    fullList.toggleAttribute("hidden");
    toggleBtn.textContent = isHidden ? "Hide full list" : "Show full list";
  });

  // Next-up card
  const nextUpCard = document.getElementById("next-up-card");
  const nextUpDay = document.getElementById("next-up-day");
  const nextUpChapter = document.getElementById("next-up-chapter");
  const nextUpCheckbox = document.getElementById("next-up-checkbox");
  const allDoneMsg = document.getElementById("all-done");

  function getNextChapter() {
    return checkboxes.find((cb) => !cb.checked);
  }

  function renderNextUp() {
    const next = getNextChapter();
    if (!next) {
      nextUpCard.hidden = true;
      allDoneMsg.hidden = false;
      return;
    }
    allDoneMsg.hidden = true;
    nextUpCard.hidden = false;

    const dayHeading = next.closest("section")?.querySelector("h4");
    nextUpDay.textContent = dayHeading ? dayHeading.textContent : "";
    nextUpChapter.textContent = next.parentElement.textContent.trim();

    nextUpCheckbox.checked = false;
    nextUpCheckbox.onchange = () => {
      if (nextUpCheckbox.checked) {
        next.checked = true;
        saveProgress();
        renderNextUp();
      }
    };
  }

  renderNextUp();
});
