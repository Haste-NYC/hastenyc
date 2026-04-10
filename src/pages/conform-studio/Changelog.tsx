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
  Changed: "text-blue-400",
  Fixed: "text-amber-400",
  Removed: "text-red-400",
  Deprecated: "text-orange-400",
  Security: "text-purple-400",
};

/**
 * Parse a Keep-a-Changelog formatted markdown string into Release objects.
 */
function parseChangelog(md: string): Release[] {
  const releases: Release[] = [];
  let current: Release | null = null;
  let currentCategory: string | null = null;

  for (const line of md.split("\n")) {
    // Version header: ## [1.14.2] - 2026-03-28
    const versionMatch = line.match(
      /^## \[([^\]]+)\]\s*-\s*(.+)$/
    );
    if (versionMatch) {
      if (current) releases.push(current);
      current = {
        version: versionMatch[1],
        date: versionMatch[2].trim(),
        changes: [],
      };
      currentCategory = null;
      continue;
    }

    // Category header: ### Added
    const categoryMatch = line.match(/^### (.+)$/);
    if (categoryMatch && current) {
      currentCategory = categoryMatch[1].trim();
      current.changes.push({ category: currentCategory, items: [] });
      continue;
    }

    // List item: - Some change
    const itemMatch = line.match(/^- (.+)$/);
    if (itemMatch && current && current.changes.length > 0) {
      current.changes[current.changes.length - 1].items.push(
        itemMatch[1].trim()
      );
    }
  }

  if (current) releases.push(current);
  return releases;
}

// Fallback data matching the real CHANGELOG.md in case the fetch fails
const fallbackReleases: Release[] = [
  {
    version: "1.14.2",
    date: "2026-03-28",
    changes: [
      {
        category: "Added",
        items: [
          "Avid panel plugin prepared for marketplace submission",
          "Offline reference clip support in Resolve via database injection after QC",
          "Multicam compound clip conversion to Resolve multicam via DRP round-trip",
          "Flatten multicam option to preserve multicam structure as nested sequences",
          "Media location relink for OCN/source media substitution",
          "Settings toggles for subtitles, through edits, multicam, bake effects, and track mute sync",
          "QC settings modal with progress tracking and error reporting",
          "Structural nested sequence detection and auto-QC service",
          "Audio stem export with active timeline restoration after conform",
        ],
      },
      {
        category: "Changed",
        items: [
          "Audio stems default to off",
          "Track mute/solo sync enabled by default",
        ],
      },
      {
        category: "Fixed",
        items: [
          "Speed change handling for reversed clips",
          "Multicam video-only OTIO split with post-DRP media relink",
          "XML injection and DRP import recovery in multicam pipeline",
          "Audio mixdown REF WAV relinking",
        ],
      },
    ],
  },
  {
    version: "1.14.1",
    date: "2026-03-15",
    changes: [
      {
        category: "Added",
        items: [
          "Electron auto-updater with GitHub Releases integration",
          "CI version bumping workflow",
        ],
      },
      {
        category: "Fixed",
        items: [
          "Prevent bumpversion from modifying dependency versions",
          "PKG installer line break before save warning",
        ],
      },
    ],
  },
  {
    version: "1.14.0",
    date: "2026-03-12",
    changes: [
      {
        category: "Added",
        items: [
          "Essential Graphics rendering as ProRes 4444 with alpha channel",
          "PKG installer creation in CI pipeline",
          "Code signing and notarization in build workflow",
          "Device management in Settings with transfer cooldown enforcement",
        ],
      },
      {
        category: "Changed",
        items: ["OAuth migrated to port 8080, Apple OAuth fix, and auth UI redesign"],
      },
      {
        category: "Fixed",
        items: [
          "OTIO adapter bundling in production builds",
          "Offline graphics support for Premiere 26.0.1+",
          "CORS-safe API bridge for browser UI",
        ],
      },
    ],
  },
  {
    version: "1.13.0",
    date: "2026-02-28",
    changes: [
      {
        category: "Added",
        items: [
          "Log viewer improvements with warnings and cancel support",
          "Media pool reporting in conversion output",
          "Billing portal integration with Stripe",
          "Machine binding and verification for license management",
        ],
      },
      {
        category: "Changed",
        items: [
          "Migrated from PySide6 desktop UI to Electron + React browser architecture",
          "Full OAuth flow with Google and Apple sign-in support",
        ],
      },
      {
        category: "Fixed",
        items: ["Backend stability improvements for long-running conversions"],
      },
    ],
  },
];

const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '')
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001');

const Changelog = () => {
  const [releases, setReleases] = useState<Release[]>(fallbackReleases);
  const [fetchedFromGitHub, setFetchedFromGitHub] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchChangelog() {
      try {
        const res = await fetch(`${API_URL}/api/changelog`);
        if (!res.ok) return;

        const text = await res.text();
        if (cancelled) return;

        const parsed = parseChangelog(text);
        if (parsed.length > 0) {
          setReleases(parsed);
          setFetchedFromGitHub(true);
        }
      } catch {
        // Silently fall back to hardcoded releases
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
            <div className="border-l border-white/[0.08] pl-8 space-y-12">
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
                  <div className="space-y-4">
                    {release.changes.map((group) => (
                      <div key={group.category}>
                        <p
                          className={`text-[11px] font-semibold tracking-[0.15em] uppercase mb-2 ${
                            categoryColor[group.category] || "text-white/40"
                          }`}
                        >
                          {group.category}
                        </p>
                        <ul className="space-y-1.5">
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
