import { getRequestConfig } from 'next-intl/server';

const locales = ['vi', 'en', 'jp'];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested) ? requested : 'vi';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
