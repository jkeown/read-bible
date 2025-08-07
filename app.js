(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach(cb => {
      const key = "chapter_" + cb.parentElement.textContent.trim();
      const isChecked = localStorage.getItem(key) === "true";
      cb.checked = isChecked;
      if (isChecked) {
        cb.parentElement.classList.add("checked");
      }

      cb.addEventListener("change", function () {
        localStorage.setItem(key, cb.checked);
        cb.parentElement.classList.toggle("checked", cb.checked);
      });
    });

    const resetButton = document.getElementById("reset-progress");
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        checkboxes.forEach(cb => {
          const key = "chapter_" + cb.parentElement.textContent.trim();
          localStorage.removeItem(key);
          cb.checked = false;
          cb.parentElement.classList.remove("checked");
        });
      });
    }
  });
})();
