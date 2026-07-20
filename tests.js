// mark all checkboxes complete
document
  .querySelectorAll('input[type="checkbox"][data-chapter]')
  .forEach((cb) => {
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
  });
