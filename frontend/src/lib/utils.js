export function formatDate(date, locale = 'vi') {
  const localeMap = { vi: 'vi-VN', en: 'en-US', jp: 'ja-JP' };
  return new Intl.DateTimeFormat(localeMap[locale] || 'vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date(date));
}

export function getTranslation(item, locale, field) {
  if (!item?.translations) return '';
  const t = item.translations[locale] || item.translations['vi'] || {};
  return t[field] || '';
}

export function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + '...' : str;
}

export function getImageUrl(path) {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5010'}${path}`;
}
