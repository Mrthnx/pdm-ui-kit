# Dropdown menu icons

## Goal
Allow `pdm-dropdown-menu` items to render a named `pdm-icon` or custom SVG/HTML on the left or right side of the label.

## Tasks

- [x] Define dropdown item icon API.
  - Evidence: `PdmMenuItem` now accepts `icon`, `iconPosition`, `leftSvg`, and `rightSvg`.
- [x] Implement left/right icon and SVG rendering.
  - Evidence: dropdown template renders named `pdm-icon` or sanitized SVG/HTML adornments on the requested side.
- [x] Run focused build verification.
  - Evidence: `npm run build` PASS (exit 0, dropdown-menu entry point compiled cleanly).

## Notes
- Keep backward compatibility for checkboxes/radio indicators and existing shortcut/chevron behavior.
- Technical artifacts stay in English.
