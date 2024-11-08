export const fetchI18n = async (language: string) => {
  const i18n = await fetch(`/api/tina/i18n/${language}`).then((response) => response.json());
  return i18n;
};