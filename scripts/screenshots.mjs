/* eslint-disable */
// Captures the README screenshots from the live site.
// Usage: SHOT_EMAIL=... SHOT_PASSWORD=... node scripts/screenshots.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.SHOT_URL || "https://triagedesk-roan.vercel.app";
const EMAIL = process.env.SHOT_EMAIL;
const PASSWORD = process.env.SHOT_PASSWORD;
const OUT = "docs/screenshots";

if (!EMAIL || !PASSWORD) {
  console.error("Set SHOT_EMAIL and SHOT_PASSWORD first.");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const desktop = { width: 1440, height: 1000 };
const phone = { width: 390, height: 844 };
const browser = await chromium.launch();

async function open(theme, viewport, extra = {}) {
  const context = await browser.newContext({
    viewport,
    colorScheme: theme,
    ...extra,
  });
  await context.addInitScript((value) => {
    try {
      localStorage.setItem("theme", value);
    } catch {}
  }, theme);
  const page = await context.newPage();
  return { context, page };
}

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
}

async function shot(page, name, options = {}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, ...options });
  console.log("saved", `${OUT}/${name}.png`);
}

// 1. Public pages
for (const theme of ["dark", "light"]) {
  const { context, page } = await open(theme, desktop);
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await settle(page);
  await shot(page, `landing-${theme}`);
  if (theme === "dark") {
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
    await settle(page);
    await shot(page, "login-dark");
    await page.goto(`${BASE}/signup`, { waitUntil: "networkidle" });
    await settle(page);
    await shot(page, "signup-dark");
  }
  await context.close();
}

// 2. Sign in once and reuse the session
const first = await open("dark", desktop);
await first.page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await first.page.fill('input[name="email"]', EMAIL);
await first.page.fill('input[name="password"]', PASSWORD);
await Promise.all([
  first.page.waitForURL("**/dashboard", { timeout: 45000 }),
  first.page.click('button[type="submit"]'),
]);
await first.page.waitForSelector("text=Showing", { timeout: 45000 });
await settle(first.page);
const state = await first.context.storageState();

await shot(first.page, "dashboard-dark");
await shot(first.page, "dashboard-full-dark", { fullPage: true });

await first.page.goto(`${BASE}/dashboard?category=billing`, {
  waitUntil: "networkidle",
});
await first.page.waitForSelector("text=Showing", { timeout: 45000 });
await first.page.locator('form[role="search"]').scrollIntoViewIfNeeded();
await settle(first.page);
await shot(first.page, "dashboard-filtered-dark");

await first.page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
await first.page.waitForSelector("text=Showing", { timeout: 45000 });
await first.page
  .locator('a[href^="/dashboard/tickets/"]:not([href$="/new"])')
  .first()
  .click();
await first.page.waitForSelector("text=Customer message", { timeout: 45000 });
await settle(first.page);
await shot(first.page, "ticket-detail-dark", { fullPage: true });

await first.page.goto(`${BASE}/dashboard/tickets/new`, {
  waitUntil: "networkidle",
});
await settle(first.page);
await shot(first.page, "new-ticket-dark");
await first.context.close();

// 3. Light mode and phone views
const light = await open("light", desktop, { storageState: state });
await light.page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
await light.page.waitForSelector("text=Showing", { timeout: 45000 });
await settle(light.page);
await shot(light.page, "dashboard-light");
await light.context.close();

const mobile = await open("dark", phone, {
  storageState: state,
  deviceScaleFactor: 2,
  isMobile: true,
});
await mobile.page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
await mobile.page.waitForSelector("text=Showing", { timeout: 45000 });
await settle(mobile.page);
await shot(mobile.page, "dashboard-mobile-dark");
await mobile.context.close();

await browser.close();
console.log("Done.");
