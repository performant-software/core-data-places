# Accessibility Requirements

Requirements for WCAG 2.2 AA compliance in Core Data Places deployments. Originates from the USS project's UVA Non-Visual Access procurement agreement and applies to all CDP sites.

## Web Content (Automated — Playwright + axe-core)

These are tested automatically by the existing test suite (`test/browser/a11y.test.ts`). See `a11y-test-results.md` for current status.

- WCAG 2.0/2.1/2.2 Level A and AA criteria across all page types
- Image alt text on all meaningful images; decorative images marked appropriately
- Color contrast ratios meeting AA thresholds
- Keyboard navigability for all interactive elements
- Semantic HTML structure (headings, landmarks, lists, tables)
- Form labels, error messages, and focus management
- ARIA attributes where semantic HTML is insufficient

## Web Content (Manual)

These require human review and cannot be fully automated. See `accessibility-checklist.md` in the USS repo for the full manual checklist.

- Screen reader testing (VoiceOver, NVDA, JAWS, TalkBack)
- Logical reading order and content flow
- Meaningful link text and navigation patterns
- Content comprehensibility and reading level
- Assistive technology compatibility across browsers
- Browser zoom behavior (up to 200%)

## PDF Accessibility

PDFs are uploaded by clients into FairData, stored on FairImage, and served as IIIF images. PDF accessibility is the client's responsibility, but we should test uploaded PDFs and report issues so clients can remediate.

**Not testable via Playwright** — PDFs served as IIIF image tiles lose their internal structure. Testing requires tools that inspect the PDF file directly.

### Automated checks (Playwright + pdf-lib or veraPDF)

Pages with PDF download links can be tested in the existing Playwright suite using a hybrid approach:

1. Playwright navigates to a page with a PDF download link
2. Triggers the download via Playwright's download handling API
3. A Node.js PDF library (`pdf-lib`, or shelling out to `veraPDF`) inspects the downloaded file
4. Test asserts on accessibility properties and reports failures

This keeps PDF checks in the same test suite and CI workflow as web content checks. Playwright handles navigation and download; the PDF library handles inspection.

**Properties we can check automatically:**

- **Tagged PDF flag** — confirm the PDF is tagged (structural requirement for screen readers)
- **Document metadata** — title, language, author set in document properties
- **Content copying enabled** — not locked against assistive technology extraction

### Manual checks (client responsibility, we document and report)

These require PAC (PDF Accessibility Checker) or Adobe Acrobat and human judgment:

#### Structure and reading order
- Correct tags for headings, paragraphs, lists, and tables
- Tag tree order matches logical reading order
- Table of Contents tagged appropriately
- Header/footer content tagged where meaningful

#### Images and graphics
- Meaningful images have concise, descriptive alt text
- Decorative images tagged as artifacts
- Text-in-images avoided; scanned content has OCR applied
- Color contrast sufficient; information not conveyed by color alone

#### Lists and tables
- Lists use proper tag hierarchy (L, LI, Lbl, LBody)
- Tables use TH/TD correctly with scope attributes
- Tables have a description/summary
- No empty cells used for layout

#### Links and footnotes
- Link text is descriptive (not "click here")
- Links are keyboard accessible and visually distinct
- New-window links warn users
- Citations and footnotes tagged correctly

#### Forms (if applicable)
- All fields labeled clearly with tooltips and required indicators
- Logical tab order
- Accessible error messages

#### Navigation
- Bookmarks present for documents over 10 pages

### Testing tools

- **PAC (PDF Accessibility Checker)** — free, Windows-only, comprehensive automated checks
- **Adobe Acrobat Pro** — built-in accessibility checker and remediation tools
- **veraPDF** — open source, CLI, good for batch automated checks
- **Screen reader validation** — manual testing with NVDA or VoiceOver reading the PDF directly
