import { useState, useCallback } from "react";
import Header from "@/components/Header";
import MessageInput from "@/components/MessageInput";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import { analyzeMessage, AnalysisResult } from "@/lib/analyzer";
import { Lang } from "@/lib/translations";

const Index = () => {
  const [lang, setLang] = useState<Lang>("en");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [originalMessage, setOriginalMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "te" : "en"));
  }, []);

  const handleAnalyze = useCallback((message: string) => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const analysisResult = analyzeMessage(message);
      setResult(analysisResult);
      setOriginalMessage(message);
      setIsAnalyzing(false);
    }, 1200);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={lang} onToggleLang={toggleLang} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 space-y-6">
        <MessageInput lang={lang} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {result && (
          <ResultsSection result={result} originalMessage={originalMessage} lang={lang} />
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
};

export default Index;
