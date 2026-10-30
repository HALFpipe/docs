# QC manual layout

The manual text is split across the `.qmd` files in this folder. The original
`quality-control.qmd` URL is now a navigation page. `_quarto.yml` supplies the
shared sidebar and reading order; `_metadata.yml` applies the QC page class and
lightbox setting. Existing captions, rating labels, tables, and instructional
wording are retained. Header levels and link paths changed to suit separate pages.

The fourteen example groups retain their existing figures and captions. A shared
`photo-viewer.js` upgrades them into one-image viewers with previous/next buttons,
a scrolling thumbnail strip, keyboard selection, and Bootstrap touch swiping.
`photo-viewer.css` controls the image stage and strip; `../styles.css` retains the
plain grid used when JavaScript is unavailable. The original lightbox links remain
on the large images. Singleton groups display one image without redundant controls.
There is no autoplay or wraparound. Printing includes every original figure.

Bootstrap already ships with the Quarto site; no new runtime dependency is added.
See https://getbootstrap.com/docs/5.3/components/carousel/ for its API. Navigation
controls are generated from the existing figures, so captions stay in one place. There is no new rating
workflow, example classification, or decision policy. ICA remains because this
change is about layout, not revising the scientific content.

`../qc-legacy-links.html` maps the old manual's section bookmarks to the new pages.
When renaming a page, update the sidebar, landing-page links, and this map. Existing
subsection IDs are explicit in the page source so bookmarked headings stay stable.
The two tab-panel bookmarks on the summary-report page are also retained.

The original manual contained two references to step 3 without a usable destination.
They remain as plain text rather than broken links. No missing step was invented.
The empty link to step 1.1.1 now points to that existing section.

Build a separate review copy from the docs repository:

```sh
quarto render --output-dir _preview-layout
```

Open `_preview-layout/quality-control.html`. Generated preview files are locally
excluded from Git; the tracked `_site` tree is not changed by this command. Edit
the source pages, not the generated HTML. Test page navigation, photo viewers, old
bookmarks, keyboard use, touch swiping, and narrow screens before publication.

Run `node tests/qc-legacy-links.mjs` to check the bookmark-routing script with
synthetic URLs. It does not load images or participant records.

Run `node tests/qc-photo-viewer.mjs` for the photo-viewer controller checks. The
test uses fabricated figures and a Bootstrap API stand-in, not participant data
or a real browser. It covers navigation, thumbnail state, keyboard selection,
boundaries, independent groups, singleton handling, and fallback. Touch behavior
and the final visual layout still require browser/device testing.

`preview-zoom.js` adds wheel zoom and mouse-drag panning to the existing Quarto
lightbox. It uses its slide lifecycle hooks and disables the conflicting native
mouse zoom/drag handlers before each image loads. Zoom is bounded from fit (100%)
to 800%; the pointer stays over the same image location where pan bounds allow.
Zoomed images extend beyond their fitted frame into the full browser window.
Panning uses the window edges rather than the original preview dimensions. The
caption is hidden while zoomed (with its layout space preserved) and restored by
Fit, so it does not cover enlarged image details. The image cannot be dragged
wholly out of view. Buttons provide zoom and Fit;
when the image has keyboard focus, +/− zoom, 0 fits, and arrow keys pan while
zoomed. Fit and switching/closing images reset the view, as does resizing. The
page's normal scrolling and image files are unchanged. Native touch behavior
still needs device testing. Styling is in `photo-viewer.css`.

Run `node tests/qc-preview-zoom.mjs` for synthetic zoom/pan checks: cursor anchoring,
wheel units, scale and translation bounds, pointer capture, controls, keyboard
handling, and resets. It uses fabricated geometry and a lightbox-event stand-in;
it does not verify real-browser GLightbox integration or touch interactions.
