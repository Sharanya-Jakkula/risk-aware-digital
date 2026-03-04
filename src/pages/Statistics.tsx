"use client";
import React, { useEffect, useRef, useState } from "react";
import { Lang } from "@/lib/translations";
import translations from "@/lib/translations";

interface StatsProps {
  data: {
    total_messages_analyzed: number;
    high_risk: number;
    suspicious: number;
    safe: number;
    fraud_type_distribution: Record<string, number>;
    average_risk_score: number;
  };
}

const Statistics: React.FC<StatsProps> = ({ data }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("gramrakshak-lang");
    return (saved as Lang) || "en";
  });

  const t = translations[lang];

  const {
    total_messages_analyzed,
    high_risk,
    suspicious,
    safe,
    fraud_type_distribution,
    average_risk_score,
  } = data;

  const percentage = (value: number) =>
    ((value / total_messages_analyzed) * 100).toFixed(1);

  return (
    <section className="bg-blue-50 py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-12">

        {/* ================= HEADER ================= */}
        <div className="text-center space-y-3 animate-in fade-in duration-500">
          <h2 className="text-3xl font-bold text-blue-800">
            {t.statisticsTitle}
          </h2>
          <p className="text-gray-600">
            {t.statisticsSubtitle}
          </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <StatCard title={t.totalAnalyzed} value={total_messages_analyzed} />
          <StatCard title={t.highRiskCount} value={high_risk} />
          <StatCard title={t.suspiciousCount} value={suspicious} />
          <StatCard title={t.safeCount} value={safe} />
        </div>

        {/* ================= RISK DISTRIBUTION ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <h3 className="text-xl font-semibold text-blue-700">
            {t.riskDistribution}
          </h3>

          <ProgressBar
            label="High Risk"
            value={high_risk}
            percent={percentage(high_risk)}
          />

          <ProgressBar
            label="Suspicious"
            value={suspicious}
            percent={percentage(suspicious)}
          />

          <ProgressBar
            label="Safe"
            value={safe}
            percent={percentage(safe)}
          />
        </div>

        {/* ================= FRAUD TYPE DISTRIBUTION ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h3 className="text-xl font-semibold text-blue-700">
            {t.fraudTypeDistribution}
          </h3>

          {Object.entries(fraud_type_distribution).map(([type, count]) => (
            <ProgressBar
              key={type}
              label={type}
              value={count}
              percent={percentage(count)}
            />
          ))}
        </div>

        {/* ================= AVERAGE RISK SCORE ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <h3 className="text-xl font-semibold text-blue-700">
            {t.averageRiskScore}
          </h3>

          <RiskScoreCircle score={average_risk_score} />

          <p className="text-gray-600">
            {t.overallAverage}
          </p>
        </div>

      </div>
    </section>
  );
};

export default Statistics;

/* ================= SMALL COMPONENTS ================= */

const StatCard = ({ title, value }: { title: string; value: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * endValue);
      
      setCount(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <p className="text-gray-500 text-sm">{title}</p>
      <h4 className="text-2xl font-bold text-blue-800 mt-2">{count}</h4>
    </div>
  );
};

const ProgressBar = ({
  label,
  value,
  percent,
}: {
  label: string;
  value: number;
  percent: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm text-gray-600">
      <span>{label}</span>
      <span>
        {value} ({percent}%)
      </span>
    </div>
    <div className="w-full bg-blue-100 rounded-full h-3">
      <div
        className="bg-blue-600 h-3 rounded-full transition-all duration-700"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const RiskScoreCircle = ({ score }: { score: number }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progressValue = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progressValue, 4);
      
      setDisplayScore(parseFloat((easeOutQuart * score).toFixed(1)));
      setProgress(easeOutQuart * 100);
      
      if (progressValue < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(score);
        setProgress(100);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="transform -rotate-90 w-40 h-40">
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-blue-100"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={440}
          strokeDashoffset={440 - (440 * progress) / 100}
          className="text-blue-600 transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-blue-800">
          {displayScore}
        </span>
      </div>
    </div>
  );
};