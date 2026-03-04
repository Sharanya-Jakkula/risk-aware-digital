import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";
import { ExternalLink, Phone, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FooterProps {
  lang: Lang;
}

const Footer = ({ lang }: FooterProps) => {
  const t = translations[lang];
  const navigate = useNavigate();

  const handleQuickLinkClick = (linkText: string) => {
    switch (linkText) {
      case t.quickLinks[0]: // "Analyze Message"
        navigate("/");
        break;
      case t.quickLinks[1]: // "Fraud Stories"
        navigate("/");
        break;
      case t.quickLinks[2]: // "Stats"
        navigate("/statistics");
        break;
      case t.quickLinks[3]: // "FAQs"
        navigate("/faq");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <footer className="border-t border-primary/30 bg-primary px-4 py-10 text-primary-foreground">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-sm">

        {/* Brand Section */}
        <div>
          <div 
            className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition w-fit"
            onClick={() => navigate("/")}
          >
            <ShieldCheck size={20} className="text-primary-foreground" />
            <span className="font-semibold">{t.brandName}</span>
          </div>
          <p className="text-primary-foreground/80">{t.brandDescription}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">{t.quickLinksTitle}</h4>
          <ul className="space-y-2 text-primary-foreground/80">
            {t.quickLinks.map((q) => (
              <li 
                key={q} 
                onClick={() => handleQuickLinkClick(q)}
                className="hover:text-white cursor-pointer transition"
              >
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency & Support */}
        <div>
          <h4 className="font-semibold mb-3">{t.emergencySupportTitle}</h4>
          <ul className="space-y-3 text-primary-foreground/80">

            <li className="flex items-center gap-2">
              <Phone size={14} className="text-red-300" />
              <a href="tel:1930" className="font-medium text-red-300 hover:text-red-200 transition">
                {t.callText}
              </a>
            </li>

            <li>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition"
              >
                {t.nationalPortalText}
                <ExternalLink size={14} />
              </a>
            </li>

          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/60">
        © 2026 GramRakshak. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;