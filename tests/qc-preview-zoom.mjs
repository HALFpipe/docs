// Fabricated image dimensions and events exercise the controller without participant images.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
const script = readFileSync(new URL('../qc/preview-zoom.js', import.meta.url), 'utf8');
class Element {
  constructor() {
    this.children = []; this.handlers = {}; this.attributes = {}; this.style = {};
    this.clientWidth = 800; this.clientHeight = 400; this.classes = new Set();
    this.classList = { add: x => this.classes.add(x), remove: x => this.classes.delete(x),
      toggle: (x, value) => value ? this.classes.add(x) : this.classes.delete(x) };
  }
  append(...children) { this.children.push(...children); }
  prepend(child) { this.children.unshift(child); }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, fn, options) { this.handlers[name] = { fn, options }; }
  emit(name, data = {}) {
    const event = { preventDefault() { this.prevented = true; },
      stopPropagation() { this.stopped = true; }, ...data };
    this.handlers[name].fn(event); return event;
  }
  getBoundingClientRect() { return { left: 0, top: 60, width: this.clientWidth, height: this.clientHeight }; }
  setPointerCapture(id) { this.captured = id; }
  hasPointerCapture(id) { return this.captured === id; }
  releasePointerCapture() { this.captured = undefined; }
}
const css = readFileSync(new URL('../qc/photo-viewer.css', import.meta.url), 'utf8');
assert.match(css, /grid-template-rows: auto minmax\(0, 1fr\) auto/);
assert.doesNotMatch(css, /visibility: hidden/);
const hooks = {}, listeners = {}; let ready;
runInNewContext(script, {
  document: { addEventListener(name, fn) { assert.equal(name, 'DOMContentLoaded'); ready = fn; },
    createElement() { return new Element(); } },
  window: { innerWidth: 1000, innerHeight: 700, lightboxQuarto: { on(name, fn) { hooks[name] = fn; } },
    addEventListener(name, fn) { listeners[name] = fn; } }
});
ready();
function fixture() {
  const image = new Element(), viewport = new Element(), slide = new Element();
  const container = new Element(), caption = new Element();
  viewport.clientWidth = 1000; viewport.clientHeight = 500; // Below controls, above caption.
  image.closest = () => viewport;
  viewport.closest = () => container;
  slide.querySelector = () => image;
  slide.append(container); container.append(viewport, caption); viewport.append(image);
  hooks.slide_after_load({ slideNode: slide });
  const toolbar = container.children[0]; const [out, status, into, fit] = toolbar.children;
  assert.equal(container.children[1], viewport);
  assert.equal(container.children[2], caption); // Caption remains in its own row.
  return { image, viewport, slide, container, caption, toolbar, out, status, into, fit };
}
const first = fixture(); const { image, viewport, slide, out, status, into, fit } = first;
function state() {
  const match = image.style.transform.match(/translate\(([^p]+)px, ([^p]+)px\) scale\(([^)]+)\)/);
  return match.slice(1).map(Number);
}
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
assert.equal(viewport.handlers.wheel.options.passive, false);
assert.equal(status.textContent, '100%'); assert.equal(out.disabled, true);
const wheel = viewport.emit('wheel', { deltaY: -300, deltaMode: 0, clientX: 700, clientY: 310 });
assert.equal(wheel.prevented, true);
assert.equal(slide.classes.has('qc-zoom-slide'), true);
let [x, y, scale] = state(); near(scale, Math.exp(.5)); near((200 - x) / scale, 200); near(y, 0);
for (let i = 0; i < 20; i++) viewport.emit('wheel', { deltaY: -300, deltaMode: 0, clientX: 500, clientY: 310 });
assert.equal(state()[2], 8); assert.equal(into.disabled, true);
for (let i = 0; i < 20; i++) viewport.emit('wheel', { deltaY: 300, deltaMode: 0, clientX: 500, clientY: 310 });
assert.deepEqual(state(), [0, 0, 1]); assert.equal(out.disabled, true);
viewport.emit('wheel', { deltaY: -1, deltaMode: 1, clientX: 500, clientY: 310 });
near(state()[2], Math.exp(16 / 600)); fit.emit('click');
viewport.emit('wheel', { deltaY: -1, deltaMode: 2, clientX: 500, clientY: 310 });
near(state()[2], Math.exp(.5)); fit.emit('click');
assert.equal(viewport.emit('wheel', { deltaY: 0 }).prevented, undefined);
const down = { pointerType: 'mouse', button: 0, pointerId: 7, clientX: 500, clientY: 310 };
assert.equal(viewport.emit('pointerdown', down).prevented, undefined); // Fit needs no panning.
into.emit('click'); into.emit('click');
assert.equal(viewport.emit('pointerdown', { ...down, pointerType: 'touch' }).prevented, undefined);
assert.equal(viewport.emit('pointerdown', { ...down, button: 2 }).prevented, undefined);
viewport.emit('pointerdown', down); assert.equal(viewport.captured, 7);
viewport.emit('pointermove', { pointerId: 8, clientX: 3000, clientY: 3000 });
assert.deepEqual(state().slice(0, 2), [0, 0]);
viewport.emit('pointermove', { pointerId: 7, clientX: 3000, clientY: 3000 });
[x, y, scale] = state(); near(x, (800 * scale - 1000) / 2); near(y, (400 * scale - 500) / 2);
viewport.emit('pointerup'); assert.equal(viewport.captured, undefined);
assert.equal(viewport.classes.has('qc-is-dragging'), false);
fit.emit('click'); assert.deepEqual(state(), [0, 0, 1]);
assert.equal(slide.classes.has('qc-zoom-slide'), true);
assert.equal(viewport.emit('keydown', { key: 'ArrowRight' }).prevented, undefined);
assert.equal(viewport.emit('keydown', { key: '+', ctrlKey: true }).prevented, undefined);
assert.equal(viewport.emit('keydown', { key: '+' }).stopped, true); near(state()[2], 1.25);
viewport.emit('keydown', { key: 'ArrowRight' }); near(state()[0], 0); // At 125%, the image fills the window width.
viewport.emit('keydown', { key: '+' });
viewport.emit('keydown', { key: 'ArrowRight' }); near(state()[0], -40);
viewport.emit('keydown', { key: '0' }); assert.deepEqual(state(), [0, 0, 1]);
assert.equal(viewport.emit('keydown', { key: 'Tab' }).prevented, undefined);
const config = { type: 'image', zoomable: true, draggable: true };
hooks.slide_before_load({ slideConfig: config });
assert.equal(config.zoomable, false); assert.equal(config.draggable, false);
const video = { type: 'video', draggable: true }; hooks.slide_before_load({ slideConfig: video });
assert.equal(video.draggable, true);
hooks.slide_changed({ current: { slideNode: slide } }); assert.equal(first.container.children.length, 3);
into.emit('click'); const second = fixture();
hooks.slide_changed({ prev: { slideNode: slide }, current: { slideNode: second.slide } });
assert.deepEqual(state(), [0, 0, 1]);
second.into.emit('click'); hooks.close(); assert.equal(second.status.textContent, '100%');
hooks.slide_changed({ current: { slideNode: slide } }); into.emit('click'); listeners.resize();
assert.equal(status.textContent, '100%');
console.log('Preview-zoom checks passed: cursor anchoring, wheel modes, reserved-workspace pan bounds, pointer capture, keyboard/buttons, reset lifecycle, and native-handler isolation.');
