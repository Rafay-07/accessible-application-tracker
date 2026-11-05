// Runs axe-core WCAG 2.0 A/AA checks against index.html with Playwright.
// Usage: npm install playwright axe-core && node tests/a11y-test.js
const { chromium } = require('playwright');
const path = require('path');
const axeSource = require('fs').readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  // Add sample data so the table and its controls are tested too.
  await page.fill('#company', 'Example Co'); await page.fill('#role', 'Data Analyst');
  await page.fill('#deadline', '2026-11-08'); await page.click('button[type=submit]');
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }));
  console.log(`Passed rules: ${results.passes.length}`);
  console.log(`Violations: ${results.violations.length}`);
  results.violations.forEach(v => console.log(`- ${v.id}: ${v.help} (${v.nodes.length} element(s))`));
  await browser.close();
  process.exit(results.violations.length ? 1 : 0);
})();
