import { I18n } from 'i18n';

export default new I18n({
  locales: ['en'],
  defaultLocale: 'en',
  objectNotation: true,
  updateFiles: false,
  staticCatalog: {
    en: require('./en.json')
  },
});