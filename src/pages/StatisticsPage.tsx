import { useState, useCallback, useEffect } from "react";
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

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // always use tunnel backend by default; override with VITE_API_URL if you need a different server
        const base = import.meta.env.VITE_API_URL || "https://m2pc2m1j-8000.inc1.devtunnels.ms";
    const resp = await fetch(`${base}/api/stats`);
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Failed to fetch stats: ${resp.status} ${text}`);
        }
        const json = await resp.json();
        setData(json);
      } catch (err: any) {
        setError(typeof err === "string" ? err : err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const listener = () => fetchStats();
    window.addEventListener('refreshStats', listener);
    return () => window.removeEventListener('refreshStats', listener);
  }, []);

  return (
    <Layout lang={lang} onToggleLang={toggleLang}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="space-y-8">
            {/* Header skeleton */}
            <div className="text-center space-y-3">
              <div className="h-8 w-64 mx-auto bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
              <div className="h-4 w-96 mx-auto bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
            </div>

            {/* Summary cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-6 text-center space-y-3 animate-pulse">
                  <div className="h-4 w-20 mx-auto bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
                  <div className="h-8 w-16 mx-auto bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
                </div>
              ))}
            </div>

            {/* Progress bars skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div className="h-6 w-40 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
                    <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded"></div>
                  </div>
                  <div className="w-full h-3 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-[length:200%_100%] animate-shimmer rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600 space-y-4">
            <div>Error loading statistics: {error}</div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                setData(null);
                // trigger fetch again
                const fetchStats = async () => {
                  try {
                    const base =
                      import.meta.env.VITE_API_URL ||
                      "https://m2pc2m1j-8000.inc1.devtunnels.ms";
                    const resp = await fetch(`${base}/api/stats`);
                    if (!resp.ok) {
                      const text = await resp.text();
                      throw new Error(`Failed to fetch stats: ${resp.status} ${text}`);
                    }
                    const json = await resp.json();
                    setData(json);
                  } catch (err: any) {
                    setError(typeof err === "string" ? err : err.message || String(err));
                  } finally {
                    setLoading(false);
                  }
                };
                fetchStats();
              }}
              className="rounded-md bg-primary px-4 py-2 text-white hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        {data && <Statistics data={data} />}

        {!loading && !error && !data && (
          <div className="text-center py-12 text-muted-foreground">No statistics available.</div>
        )}
      </div>
    </Layout>
  );
};

export default StatisticsPage;
