import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import Statistics from "./Statistics";
import { Lang } from "@/lib/translations";

const StatisticsPage = () => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const newLang = prev === "en" ? "te" : "en";
      localStorage.setItem("gramrakshak-lang", newLang);
      return newLang;
    });
  }, []);

  // Sample data for statistics
  const sampleData = {
    total_messages_analyzed: 1240,
    high_risk: 145,
    suspicious: 320,
    safe: 775,
    fraud_type_distribution: {
      "Phishing": 85,
      "Spam": 140,
      "Scam": 95,
      "Other": 50,
    },
    average_risk_score: 35.5,
  };

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <Statistics data={sampleData} />
    </Layout>
  );
};

export default StatisticsPage;
