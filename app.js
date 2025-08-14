
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"][data-chapter]');
  const storageKey = "bibleReadingProgress";

  // Load saved progress
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  checkboxes.forEach(cb => {
    const chapterId = cb.dataset.chapter;
    if (saved[chapterId]) {
      cb.checked = true;
    }
  });

  // Save progress on change
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const chapterId = cb.dataset.chapter;
      saved[chapterId] = cb.checked;
      localStorage.setItem(storageKey, JSON.stringify(saved));
    });
  });

  // Reset button
  const resetBtn = document.getElementById('reset-progress')

  resetBtn.addEventListener("click", () => {
  checkboxes.forEach(cb => cb.checked = false);

  localStorage.removeItem(storageKey);

  Object.keys(saved).forEach(key => delete saved[key]);
});




  // Scroll to last checked
  const checkedChapters = Array.from(checkboxes).filter(cb => cb.checked);
  if (checkedChapters.length > 0) {
    const lastChecked = checkedChapters[checkedChapters.length - 1];
    lastChecked.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
