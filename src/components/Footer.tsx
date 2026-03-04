import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

interface FooterProps {
  lang: Lang;
}

const Footer = ({ lang }: FooterProps) => {
  const t = translations[lang];

  return (
    <footer className="border-t border-border bg-card py-6 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">{t.footer}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {t.team} &bull; {t.organizer}
      </p>
    </footer>
  );
};

export default Footer;
