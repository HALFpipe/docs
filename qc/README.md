# QC manual layout

The manual is split into eleven `.qmd` pages. `_quarto.yml` supplies the sidebar
and reading order. The overview links to each page; the page contents and sidebar
provide section navigation. Existing instructions, examples, captions, and rating
labels are retained.

Example groups use Quarto's built-in collapsible callouts. Their titles repeat
the page title and existing example heading. `lightbox: true` enables Quarto's
standard image preview. There is no custom JavaScript or additional CSS.
Quarto supplies its own scripts and styles for these built-in features.

The overview retains old section IDs beside the corresponding page links.
Old bookmarks reach those links, rather than automatically redirecting to a new
page. Update overview links and the sidebar together when renaming pages.

Render a separate review copy with:

```sh
quarto render --output-dir _preview-layout
```

The interactive prototype remains on `codex/qc-manual-layout` at `fdb810b`.
Its carousel, thumbnail strip, and custom full-screen pan/zoom viewer are deferred.
