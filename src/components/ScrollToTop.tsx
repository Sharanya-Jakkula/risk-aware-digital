import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Support hash links like /#fraud-stories while resetting scroll for normal route changes.
    if (hash) {
      requestAnimationFrame(() => {
        const target = document.getElementById(hash.replace("#", ""));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
