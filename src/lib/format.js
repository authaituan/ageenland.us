// Money formatting driven by CMS settings (site.locale, site.currency_code).
// Whole amounts show no decimals ($1,360); unit rates keep cents ($0.02).
export function formatMoney(value, site = {}) {
  const n = Number(value) || 0;
  const locale = site.locale || 'en-US';
  const currency = site.currency_code || 'USD';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toLocaleString('en-US')} ${currency}`;
  }
}
