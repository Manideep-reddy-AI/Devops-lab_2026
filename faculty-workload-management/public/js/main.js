(() => {
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    const msg = form.getAttribute("data-confirm");
    if (!msg) return;
    if (!window.confirm(msg)) e.preventDefault();
  });
})();

