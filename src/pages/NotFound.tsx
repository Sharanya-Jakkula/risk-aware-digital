import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

const NotFound = () => {
  const location = useLocation();
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const t = translations[lang];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t.notFoundTitle}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t.notFoundMessage}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {t.returnHome}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
