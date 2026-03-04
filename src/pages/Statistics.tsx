"use client";
import React from "react";

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
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-blue-800">
            Fraud Analysis Statistics
          </h2>
          <p className="text-gray-600">
            Overview of analyzed messages and detected fraud patterns
          </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Analyzed" value={total_messages_analyzed} />
          <StatCard title="High Risk" value={high_risk} />
          <StatCard title="Suspicious" value={suspicious} />
          <StatCard title="Safe" value={safe} />
        </div>

        {/* ================= RISK DISTRIBUTION ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h3 className="text-xl font-semibold text-blue-700">
            Risk Distribution
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
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h3 className="text-xl font-semibold text-blue-700">
            Fraud Type Distribution
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
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold text-blue-700">
            Average Risk Score
          </h3>

          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-800">
                {average_risk_score}
              </span>
            </div>
          </div>

          <p className="text-gray-600">
            Overall average risk across analyzed messages
          </p>
        </div>

      </div>
    </section>
  );
};

export default Statistics;

/* ================= SMALL COMPONENTS ================= */

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h4 className="text-2xl font-bold text-blue-800 mt-2">{value}</h4>
  </div>
);

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