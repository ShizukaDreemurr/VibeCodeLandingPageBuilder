// Ứng dụng chia thành nhiều tab (Thông tin / Thiết kế trang / Quản lý).
// Trước khi click/fill/check một phần tử, tự mở tab chứa nó để kịch bản test không phụ thuộc tab đang mở.
async function openTabFor(page, sel) {
  await page.evaluate((s) => {
    var el; try { el = document.querySelector(s); } catch (e) { return; }
    var view = el && el.closest('.view');
    if (view && view.hidden) {
      var tab = document.querySelector('[data-tab="' + view.id.replace('view-', '') + '"]');
      if (tab) tab.click();
    }
    var wp = el && el.closest('.ws-panel');
    if (wp && (wp.hidden || wp.closest('.ws-panels')) && window.EP && window.EP.workspace) window.EP.workspace.show(wp.getAttribute('data-panel'));
  }, sel).catch(() => {});
}
function wrap(page) {
  ['click', 'fill', 'check', 'selectOption', 'setInputFiles', 'type', 'press'].forEach((m) => {
    const orig = page[m].bind(page);
    page[m] = async (sel, ...rest) => { if (typeof sel === 'string') await openTabFor(page, sel); return orig(sel, ...rest); };
  });
  return page;
}
module.exports = function (browser) {
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (...a) => {
    const ctx = await newContext(...a);
    const newPage = ctx.newPage.bind(ctx);
    ctx.newPage = async () => wrap(await newPage());
    return ctx;
  };
  return browser;
};
