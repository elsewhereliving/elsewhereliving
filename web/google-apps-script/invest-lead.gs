/**
 * Investor shortlist leads (/invest/) → Google Sheet.
 *
 * Paste this into the Apps Script editor of the investor-leads Sheet
 * (Extensions → Apps Script), deploy it as a web app, and set the /exec URL
 * as INVEST_LEAD_SHEET_URL in Cloudflare Pages. Full steps: DEPLOY.md,
 * "Part 5 — Investor shortlist leads".
 *
 * Called only by the Cloudflare function web/functions/api/invest-lead.ts,
 * which has already validated the fields.
 */
var HEADERS = [
  "Received", "Name", "Email", "WhatsApp", "Country of residence", "Budget (USD)",
  "Purpose", "Strategy", "Bedrooms", "Ownership", "Completion", "Shortlist shown",
  "Source (UTM)", "IP country", "Page",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      d.received ? new Date(d.received) : new Date(),
      text(d.name), text(d.email), text(d.whatsapp), text(d.country), Number(d.budget) || "",
      text(d.purpose), text(d.strategy), text(d.bedrooms), text(d.ownership), text(d.completion),
      text(d.shortlist), text(d.source), text(d.ip_country), text(d.page),
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Store everything as plain text: keeps "+66…" phone numbers intact and stops
// a value starting with = + - @ from being run as a formula.
function text(v) {
  v = v == null ? "" : String(v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
