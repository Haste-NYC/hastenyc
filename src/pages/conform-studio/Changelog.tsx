import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

interface ChangeGroup {
  category: string;
  items: string[];
}

interface Release {
  version: string;
  date: string;
  changes: ChangeGroup[];
}

const categoryColor: Record<string, string> = {
  Added: "text-emerald-400",
  Fixed: "text-amber-400",
};

const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '')
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

const Changelog = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [fetchedFromGitHub, setFetchedFromGitHub] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchChangelog() {
      try {
        const res = await fetch(`${API_URL}/api/changelog`);
        if (!res.ok) return;

        const data: Release[] = await res.json();
        if (cancelled) return;

        if (data.length > 0) {
          setReleases(data);
          setFetchedFromGitHub(true);
        }
      } catch {
        // Silently fall back
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchChangelog();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Changelog"
        description="Release notes and version history for Conform Studio."
        canonical="/conform-studio/changelog"
      />
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
              Conform Studio
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Changelog
            </h1>
            <p className="text-base text-white/50 max-w-xl mx-auto">
              Release notes and version history
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            {loading && releases.length === 0 && (
              <p className="text-sm text-white/30 text-center">Loading releases...</p>
            )}
            <div className="border-l border-white/[0.08] pl-8 space-y-10">
              {releases.map((release) => (
                <div key={release.version} className="relative">
                  {/* Dot on timeline */}
                  <div className="absolute -left-8 top-1 w-[9px] h-[9px] rounded-full border-2 border-white/30 bg-background translate-x-[-4.5px]" />

                  {/* Version + date */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] border border-white/[0.08] text-white">
                      v{release.version}
                    </span>
                    <span className="text-sm text-white/40">
                      {release.date}
                    </span>
                  </div>

                  {/* Changes */}
                  <div className="space-y-3">
                    {release.changes.map((group) => (
                      <div key={group.category}>
                        <p
                          className={`text-[11px] font-semibold tracking-[0.15em] uppercase mb-1.5 ${
                            categoryColor[group.category] || "text-white/40"
                          }`}
                        >
                          {group.category}
                        </p>
                        <ul className="space-y-1">
                          {group.items.map((item, i) => (
                            <li
                              key={i}
                              className="text-sm text-white/60 leading-relaxed"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {fetchedFromGitHub && (
              <p className="text-xs text-white/20 text-center mt-12">
                Synced from source
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer hideAsciiLogo />
    </div>
  );
};

export default Changelog;
