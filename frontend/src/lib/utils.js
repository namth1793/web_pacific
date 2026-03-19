export function formatDate(date, locale = 'vi') {
  if (!date) return '';
  try {
    const localeMap = { vi: 'vi-VN', en: 'en-US', jp: 'ja-JP' };
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(localeMap[locale] || 'vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(d);
  } catch {
    return '';
  }
}

export function getTranslation(item, locale, field) {
  if (!item) return '';
  // Handle JSON string (SQLite stores as TEXT)
  let trans = item.translations;
  if (typeof trans === 'string') {
    try { trans = JSON.parse(trans); } catch { return ''; }
  }
  if (!trans || typeof trans !== 'object') return '';
  const t = trans[locale] || trans['vi'] || {};
  const val = t[field];
  return typeof val === 'string' ? val : (val ?? '');
}

export function truncate(str, n) {
  const s = str == null ? '' : String(str);
  return s.length > n ? s.slice(0, n - 1) + '...' : s;
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5010'}${path}`;
}

export function toArray(val) {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object' && Array.isArray(val.data)) return val.data;
  return [];
}
