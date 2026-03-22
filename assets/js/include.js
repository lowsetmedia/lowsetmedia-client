async function loadIncludes() {
  const elements = document.querySelectorAll("[data-include]");

  if (elements.length === 0) return;

  await Promise.all(
    [...elements].map(async (el) => {
      const file = el.getAttribute("data-include");

      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error("File not found");

        const html = await res.text();

        // prevent reprocessing the same element
        el.removeAttribute("data-include");

        el.innerHTML = html;
      } catch (err) {
        console.error(`Include failed: ${file}`, err);
        el.innerHTML = "";
      }
    })
  );

  // run again to catch nested includes
  loadIncludes();
}

document.addEventListener("DOMContentLoaded", loadIncludes);