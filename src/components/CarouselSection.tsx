"use client";
import { useEffect, useState } from "react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

interface Slide {
  tag: string;
  title: string;
  description: string;
  icon: string;
  stat: string;
  statLabel: string;
}

const DURATION = 5000;
const BG =
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80&fit=crop";

const getSlides = (t: any): Slide[] => [
  {
    tag: t.emailThreatTag,
    title: t.phishingEmailTitle,
    description: t.phishingEmailDesc,
    icon: "📧",
    stat: "3.4B",
    statLabel: t.phishingEmails,
  },
  {
    tag: t.identityTheftTag,
    title: t.otpFraudTitle,
    description: t.otpFraudDesc,
    icon: "🔐",
    stat: "₹1.25L",
    statLabel: t.otpLoss,
  },
  {
    tag: t.jobScamTag,
    title: t.fakeJobTitle,
    description: t.fakeJobDesc,
    icon: "💼",
    stat: "68%",
    statLabel: t.jobVictims,
  },
  {
    tag: t.appFraudTag,
    title: t.loanAppTitle,
    description: t.loanAppDesc,
    icon: "📱",
    stat: "500+",
    statLabel: t.illegalApps,
  },
  {
    tag: t.romanceScamTag,
    title: t.romanceScamTitle,
    description: t.romanceScamDesc,
    icon: "💔",
    stat: "₹5L+",
    statLabel: t.romanceLoss,
  },
  {
    tag: t.investmentFraudTag,
    title: t.investmentScamTitle,
    description: t.investmentScamDesc,
    icon: "📈",
    stat: "₹2.5Cr",
    statLabel: t.investmentLoss,
  },
  {
    tag: t.paymentFraudTag,
    title: t.upiScamTitle,
    description: t.upiScamDesc,
    icon: "💳",
    stat: "45%",
    statLabel: t.digitalFraudRise,
  },
  {
    tag: t.smsFraudTag,
    title: t.smishingTitle,
    description: t.smishingDesc,
    icon: "💬",
    stat: "1 in 5",
    statLabel: t.phishingSms,
  },
];

export default function CarouselSection() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const t = translations[lang];
  const [slides] = useState<Slide[]>(() => getSlides(t));
  const [current, setCurrent] = useState<number>(0);
  const [animKey, setAnimKey] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const goTo = (index: number) => {
    setCurrent(index);
    setAnimKey((k) => k + 1);
    setProgress(0);
  };

  const next = (): void => goTo((current + 1) % slides.length);

  useEffect(() => {
    const t = setInterval(next, DURATION);
    return () => clearInterval(t);
  }, [current]);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const t = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / DURATION) * 100, 100));
    }, 30);
    return () => clearInterval(t);
  }, [current]);

  const s: Slide = slides[current];

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden py-16"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseEnter={next}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 via-blue-50/80 to-blue-100/90 z-10" />

      {/* Inner Card with rounded corners */}
      <div
        key={animKey}
        className="relative z-20 w-full max-w-7xl mx-6 md:mx-12 flex flex-col md:flex-row items-center justify-between gap-10 bg-white/80 p-8 shadow-xl rounded-xl"
        style={{
          transform: "translateY(20px)",
          animation: "slideInFade 0.6s forwards",
          height: "280px",
        }}
      >
        {/* Left: Text */}
        <div className="flex-1 h-full flex flex-col justify-center text-center md:text-left gap-4">
          <span className="inline-block text-xs md:text-xs font-mono font-medium text-blue-600 bg-white/70 px-4 py-1 border border-blue-200 rounded-lg">
            ⚑ {t.fraudAwareness}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-blue-900">
            {s.title}
          </h2>
          <p className="text-gray-700 text-sm md:text-base">{s.description}</p>
        </div>

        {/* Right: Icon + Stats with rounded corners */}
        <div className="flex-1 h-full relative bg-gradient-to-tr from-blue-600 to-blue-400 p-6 flex flex-col items-center gap-4 shadow-lg overflow-hidden rounded-lg justify-center">
          <span className="text-5xl animate-bounce">{s.icon}</span>
          <div className="text-white text-3xl md:text-4xl font-bold">{s.stat}</div>
          <p className="text-white/80 text-sm md:text-base text-center">{s.statLabel}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-6 left-6 right-6 h-2 bg-blue-200/50 overflow-hidden rounded-full">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide-in animation */}
      <style>
        {`
          @keyframes slideInFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}