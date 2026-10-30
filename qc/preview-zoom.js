document.addEventListener("DOMContentLoaded", () => {
  const lightbox = window.lightboxQuarto;
  if (!lightbox?.on) return;
  const controllers = new WeakMap();
  let active;
  const attach = (slide) => {
    if (!slide) return;
    if (controllers.has(slide)) return controllers.get(slide);
    const image = slide.querySelector(".gslide-image img");
    if (!image) return;
    const viewport = image.closest(".gslide-image");
    const container = viewport.closest(".ginner-container");
    slide.classList.add("qc-zoom-slide");
    viewport.classList.add("qc-zoom-viewport");
    viewport.tabIndex = 0;
    viewport.setAttribute("aria-label", "Image preview: scroll to zoom; drag to pan when zoomed");
    image.draggable = false;
    image.addEventListener("dragstart", (event) => event.preventDefault());
    const toolbar = document.createElement("div");
    toolbar.className = "qc-zoom-controls";
    toolbar.setAttribute("role", "group");
    toolbar.setAttribute("aria-label", "Image zoom");
    const button = (text, label) => {
      const element = document.createElement("button");
      element.type = "button";
      element.textContent = text;
      element.setAttribute("aria-label", label);
      return element;
    };
    const out = button("−", "Zoom out");
    const into = button("+", "Zoom in");
    const fit = button("Fit", "Fit image to preview");
    const status = document.createElement("span");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    toolbar.append(out, status, into, fit);
    container.prepend(toolbar);
    let scale = 1, x = 0, y = 0, drag;
    const bound = (position, size, available) => {
      const limit = Math.abs(size * scale - available) / 2;
      return Math.max(-limit, Math.min(limit, position));
    };
    const render = () => {
      // The image workspace excludes the always-visible toolbar and caption rows.
      x = bound(x, image.clientWidth, viewport.clientWidth);
      y = bound(y, image.clientHeight, viewport.clientHeight);
      if (scale === 1) x = y = 0;
      image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      viewport.classList.toggle("qc-is-zoomed", scale > 1);
      status.textContent = `${Math.round(scale * 100)}%`;
      out.disabled = scale <= 1; into.disabled = scale >= 8;
    };
    const zoom = (factor, clientX, clientY) => {
      const rect = viewport.getBoundingClientRect();
      const px = clientX === undefined ? 0 : clientX - rect.left - rect.width / 2;
      const py = clientY === undefined ? 0 : clientY - rect.top - rect.height / 2;
      const next = Math.max(1, Math.min(8, scale * factor));
      // Keep the point under the cursor stationary as the image scales.
      const ratio = next / scale;
      x = px - (px - x) * ratio; y = py - (py - y) * ratio;
      scale = next; render();
    };
    const stopDrag = () => {
      if (drag && viewport.hasPointerCapture(drag.id)) viewport.releasePointerCapture(drag.id);
      drag = undefined;
      viewport.classList.remove("qc-is-dragging");
    };
    const reset = () => { stopDrag(); scale = 1; x = y = 0; render(); };
    viewport.addEventListener("wheel", (event) => {
      if (!event.deltaY) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
      const delta = Math.max(-300, Math.min(300, event.deltaY * unit));
      zoom(Math.exp(-delta / 600), event.clientX, event.clientY);
    }, { passive: false });
    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0 || scale <= 1) return;
      event.preventDefault(); event.stopPropagation();
      drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x, y };
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("qc-is-dragging");
    });
    viewport.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      event.preventDefault();
      x = drag.x + event.clientX - drag.startX;
      y = drag.y + event.clientY - drag.startY;
      render();
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      viewport.addEventListener(event, stopDrag);
    viewport.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const pan = { ArrowLeft: [40, 0], ArrowRight: [-40, 0],
        ArrowUp: [0, 40], ArrowDown: [0, -40] };
      if (["+", "="].includes(event.key)) zoom(1.25);
      else if (["-", "_"].includes(event.key)) zoom(1 / 1.25);
      else if (event.key === "0") reset();
      else if (scale > 1 && Object.hasOwn(pan, event.key)) {
        x += pan[event.key][0]; y += pan[event.key][1]; render();
      } else return;
      event.preventDefault(); event.stopPropagation();
    });
    out.addEventListener("click", () => zoom(1 / 1.25));
    into.addEventListener("click", () => zoom(1.25));
    fit.addEventListener("click", reset);
    const controller = { reset };
    controllers.set(slide, controller);
    reset();
    return controller;
  };
  // GLightbox's own mouse handlers navigate/toggle zoom and would fight these transforms.
  lightbox.on("slide_before_load", ({ slideConfig }) => {
    if (slideConfig.type === "image") {
      slideConfig.zoomable = false;
      slideConfig.draggable = false;
    }
  });
  lightbox.on("slide_after_load", ({ slideNode }) => attach(slideNode));
  lightbox.on("slide_changed", ({ prev, current }) => {
    controllers.get(prev?.slideNode)?.reset();
    active = attach(current?.slideNode);
    active?.reset();
  });
  lightbox.on("close", () => { active?.reset(); active = undefined; });
  window.addEventListener("resize", () => active?.reset());
});
