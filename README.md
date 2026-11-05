# Co-op Application Tracker

A small web app for tracking co-op and job applications, built to meet the **WCAG 2.0 Level AA** standard that Ontario's **Accessibility for Ontarians with Disabilities Act (AODA)** requires for websites.

- **Demo video:** [`demo/demo.mp4`](demo/demo.mp4) (17 seconds, keyboard-driven walkthrough)
- **User guide:** [`USER_GUIDE.md`](USER_GUIDE.md)
- **Built with:** HTML, CSS, JavaScript (no frameworks), browser localStorage
- **Tested with:** axe-core automated WCAG 2.0 A/AA checks through Playwright (22 rules passed, 0 violations)

## Run the app

Open `index.html` in any browser. No build step or server is needed.

## Features

- Add applications with company, role, deadline and status
- Filter by status and search by company or role
- Update status in place, delete applications
- Sorted by deadline, soonest first
- Saved in the browser between visits

## How the app meets AODA / WCAG 2.0 AA

| WCAG criterion | How it is met |
|---|---|
| 1.3.1 Info and relationships | Every input has a `<label>`; the table uses `<th scope="col">` and a caption; sections use headings in order |
| 1.4.3 Contrast (minimum) | All text is at least 4.5:1 against its background (main accent colour is 8.6:1) |
| 2.1.1 Keyboard | Every action works with Tab, Shift + Tab, Enter and arrow keys; no mouse needed |
| 2.4.1 Bypass blocks | "Skip to main content" link is the first focusable element |
| 2.4.7 Focus visible | A 3px yellow outline shows which element has focus |
| 3.1.1 Language of page | `<html lang="en">` |
| 3.3.1 Error identification | Empty required fields show a text error, are marked `aria-invalid`, and get focus |
| 3.3.2 Labels or instructions | Required fields are marked, and the deadline field has a hint |
| 4.1.2 Name, role, value | Row controls have specific labels, such as "Delete Softchoice Data Analyst Co-op" |
| 4.1.3 Status messages | An `aria-live` region announces additions, deletions, and filter results |

## Run the accessibility test

```bash
npm install
npx playwright install chromium
npm test
```

The script adds sample data, runs axe-core against WCAG 2.0 A and AA rules, and lists any violations.
