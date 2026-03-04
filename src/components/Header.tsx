import { ShieldCheck, Globe } from "lucide-react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

interface HeaderProps {
  lang: Lang;
  onToggleLang: () => void;
}

const Header = ({ lang, onToggleLang }: HeaderProps) => {
  const t = translations[lang];

  return (
    <header className="relative overflow-hidden bg-primary py-10 px-4 text-primary-foreground">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-primary-foreground/20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-primary-foreground/10 translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Language toggle */}
        <button
          onClick={onToggleLang}
          className="absolute top-0 right-0 flex items-center gap-1.5 rounded-lg border border-primary-foreground/30 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
        >
          <Globe size={14} />
          {t.langToggle}
        </button>

        <div className="mb-3 flex justify-center">
          <div className="rounded-2xl bg-primary-foreground/15 p-4">
            <ShieldCheck size={40} strokeWidth={1.8} />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
        <p className="mt-2 text-base text-primary-foreground/80 sm:text-lg">{t.subtitle}</p>
      </div>
    </header>
  );
};

export default Header;
