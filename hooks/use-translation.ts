import { useLanguage } from "@/components/providers/language-provider";
import { translations } from "@/lib/i18n";

const FALLBACK_LOCALE = "en" as const;

export type TranslationKey = keyof typeof translations["en"];

type Vars = Record<string, string | number>;

const formatMessage = (message: string, vars?: Vars) => {
  if (!vars) return message;
  return Object.keys(vars).reduce((acc, key) => {
    const value = String(vars[key]);
    return acc.replaceAll(`{{${key}}}`, value);
  }, message);
};

export const useTranslation = () => {
  const { locale } = useLanguage();

  return (key: TranslationKey, vars?: Vars) => {
    const messages = translations[locale] ?? translations[FALLBACK_LOCALE];
    const fallbackMessages = translations[FALLBACK_LOCALE];
    const message = messages[key] ?? fallbackMessages[key] ?? key;
    return formatMessage(message, vars);
  };
};
