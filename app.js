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
      renderReading();
    });
  });

  // Reset button
  const resetBtn = document.getElementById("reset-progress");
  resetBtn.addEventListener("click", () => {
    const userConfirmed = confirm(
      "Are you sure you want to clear all progress?",
    );
    if (userConfirmed) {
      checkboxes.forEach((cb) => (cb.checked = false));
      localStorage.removeItem(storageKey);
      Object.keys(saved).forEach((key) => delete saved[key]);
      renderReading();
    }
  });

  // Toggle full list
  const toggleBtn = document.getElementById("toggle-list");
  const fullList = document.getElementById("full-list");

  toggleBtn.addEventListener("click", () => {
    const isHidden = fullList.hasAttribute("hidden");
    fullList.toggleAttribute("hidden");
    toggleBtn.textContent = isHidden ? "Hide full list" : "Show full list";

    if (isHidden) {
      // list was just opened - scroll it to the top of the current day
      const daySection = getNextChapter()?.closest("section");
      if (daySection) {
        const listTop = fullList.getBoundingClientRect().top;
        const dayTop = daySection.getBoundingClientRect().top;
        fullList.scrollTop += dayTop - listTop;
      }
    }
  });

// Next-up card
const readingCard = document.getElementById("reading-card");
const currentDay = document.getElementById("current-day");
const currentChapter = document.getElementById("current-chapter");
const readingDay = document.getElementById("next-up-day");
const readingChapter = document.getElementById("next-up-chapter");
const upcomingPreview = document.getElementById("upcoming-preview");
const readingCheckbox = document.getElementById("next-up-checkbox");
const allDoneMsg = document.getElementById("all-done");

function getNextChapter() {
  return checkboxes.find((cb) => !cb.checked);
}

function renderReading() {
  const current = getNextChapter();

  if (!current) {
    readingCard.hidden = true;
    allDoneMsg.hidden = false;
    return;
  }
  allDoneMsg.hidden = true;
  readingCard.hidden = false;

  // Current chapter
  const currentDayHeading = current.closest("section")?.querySelector("h4");
  currentDay.textContent = currentDayHeading ? currentDayHeading.textContent : "";
  currentChapter.textContent = current.parentElement.textContent.trim();

  // Upcoming chapter — the next UNCHECKED one after current, skipping any
  // already-checked chapters that come later out of order
  const currentIndex = checkboxes.indexOf(current);
  const upcoming = checkboxes
    .slice(currentIndex + 1)
    .find((cb) => !cb.checked);

  if (upcoming) {
    const upcomingDayHeading = upcoming.closest("section")?.querySelector("h4");
    readingDay.textContent = upcomingDayHeading ? upcomingDayHeading.textContent : "";
    readingChapter.textContent = upcoming.parentElement.textContent.trim();
    upcomingPreview.hidden = false;
  } else {
    upcomingPreview.hidden = true; // current is the last chapter in the plan
  }

  readingCheckbox.checked = false;
  readingCheckbox.onchange = () => {
    if (readingCheckbox.checked) {
      current.checked = true;
      saveProgress();
      renderReading();
    }
  };
}

renderReading();

}); // end DOMContentLoaded