# QC manual layout

The manual text is split across the `.qmd` files in this folder. The original
`quality-control.qmd` URL is now a navigation page. `_quarto.yml` supplies the
shared sidebar and reading order; `_metadata.yml` applies the QC page class and
lightbox setting. Existing captions, rating labels, tables, and instructional
wording are retained. Header levels and link paths changed to suit separate pages.

The fourteen collapsible example galleries are retained. Their layout and the
landing-page cards use scoped rules in `../styles.css`. There is no new rating
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
the source pages, not the generated HTML. Test page navigation, galleries, old
bookmarks, keyboard use, and narrow screens before publication.

Run `node tests/qc-legacy-links.mjs` to check the bookmark-routing script with
synthetic URLs. It does not load images or participant records.
