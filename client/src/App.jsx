import { useEffect, useMemo, useState } from "react";
import { requestReport, searchAssets } from "./services/reportApi.js";

const LEVELS = ["debutant", "intermediaire", "expert"];
const ASSET_PATTERN = /^[A-Z0-9]{2,15}$/;

export default function App() {
  const [assetsInput, setAssetsInput] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [assetNotice, setAssetNotice] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [level, setLevel] = useState("debutant");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("intro");

  const canSubmit = selectedAssets.length >= 1 && selectedAssets.length <= 3 && level;

  useEffect(() => {
    const term = assetsInput.trim();
    if (term.length < 1) {
      setSuggestions([]);
      setSuggestError("");
      return;
    }
    let active = true;
    setSuggestLoading(true);
    setSuggestError("");
    const timer = setTimeout(() => {
      searchAssets(term)
        .then((results) => {
          if (!active) return;
          setSuggestions(results.slice(0, 8));
          setActiveIndex(-1);
        })
        .catch((err) => {
          if (!active) return;
          setSuggestError(err.message || "Erreur de recherche.");
          setSuggestions([]);
        })
        .finally(() => {
          if (!active) return;
          setSuggestLoading(false);
        });
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [assetsInput]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const payload = {
        OBJECTIF: "analyse_long_terme",
        NIVEAU: level,
        ASSETS: selectedAssets,
        PERIODE: "5a",
        INCLUDE: {
          NEWS: false,
          CHARTS: true,
          COMPARE: true,
          LLM_ADVISORY: false
        }
      };
      const data = await requestReport(payload);
      setReport(data);
      setActiveTab("intro");
    } catch (err) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  const addAsset = (symbol) => {
    const normalized = symbol.trim().toUpperCase();
    if (!ASSET_PATTERN.test(normalized)) return;
    if (selectedAssets.includes(normalized)) return;
    if (selectedAssets.length >= 3) {
      setAssetNotice("Maximum 3 actifs.");
      return;
    }
    setSelectedAssets((prev) => [...prev, normalized]);
    setAssetsInput("");
    setSuggestions([]);
    setActiveIndex(-1);
    setAssetNotice("");
  };

  const removeAsset = (symbol) => {
    setSelectedAssets((prev) => prev.filter((item) => item !== symbol));
    setAssetNotice("");
  };

  const handleKeyDown = (event) => {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0) {
        const selected = suggestions[activeIndex];
        if (selected?.symbol) addAsset(selected.symbol);
      } else if (assetsInput.trim()) {
        addAsset(assetsInput);
      }
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true" />
            <div>
              <p className="eyebrow">CryptoSense</p>
              <h1>Analyse long terme, claire et neutre</h1>
              <p className="tagline">Rapports structurés, data-only, sans conseil financier.</p>
            </div>
          </div>
          <div className="header-badges">
            <span className="badge ghost">No advice</span>
            <span className="badge ghost">Data-first</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="card">
          <div className="card-title">
            <h2>Selection</h2>
            <span className="badge">1–3 actifs</span>
          </div>
          <p className="muted">Choisissez vos actifs et un niveau pedagogique.</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="assets">Actifs (ex: BTC, ETH)</label>
              <input
                id="assets"
                type="text"
                placeholder="BTC"
                value={assetsInput}
                onChange={(event) => setAssetsInput(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <small>Ajoutez 1 a 3 actifs. Entree pour valider.</small>
              {suggestLoading && <small className="hint">Recherche...</small>}
              {suggestError && <small className="error">{suggestError}</small>}
              {assetNotice && <small className="warning">{assetNotice}</small>}
              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((item, index) => (
                    <li key={`${item.id}-${item.symbol}`}>
                      <button
                        type="button"
                        className={index === activeIndex ? "active" : ""}
                        onClick={() => addAsset(item.symbol)}
                      >
                        {item.name} ({item.symbol})
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {selectedAssets.length > 0 && (
                <div className="chips">
                  {selectedAssets.map((symbol) => (
                    <span key={symbol} className="chip">
                      {symbol}
                      <button
                        type="button"
                        className="chip-remove"
                        onClick={() => removeAsset(symbol)}
                        aria-label={`Retirer ${symbol}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor="level">Niveau</label>
              <select
                id="level"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
              >
                {LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <button className="primary" disabled={!canSubmit || loading}>
              {loading ? "Generation..." : "Lancer l'analyse"}
            </button>
          </form>
          {error && <p className="error alert">Erreur: {error}</p>}
        </section>

        <section className="card report-card">
          <div className="card-title">
            <h2>Rapport</h2>
            {report?.meta?.fallback && <span className="badge warning">DATA-ONLY</span>}
            {loading && <span className="badge info">Loading</span>}
          </div>
          {!report && !loading && <p className="muted">Le rapport s'affichera ici apres generation.</p>}
          {loading && <div className="placeholder">Generation en cours...</div>}
          {report && (
            <>
              {report.meta?.fallback && (
                <p className="warning subtle">Fallback data-only actif (LLM indisponible).</p>
              )}
              <ReportTabs
                reportMarkdown={report.reportMarkdown}
                meta={report.meta}
                hasComparison={Boolean(report.sections?.comparison && selectedAssets.length >= 2)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <small>CryptoSense - Rapport informatif, sans recommandations.</small>
      </footer>
    </div>
  );
}

function ReportTabs({ reportMarkdown, meta, hasComparison, activeTab, onTabChange }) {
  const sections = useMemo(() => splitMarkdownSections(reportMarkdown), [reportMarkdown]);
  const intro = buildIntro(sections, meta);

  const tabs = [
    { id: "intro", label: "CryptoSense", content: intro },
    { id: "market", label: "Marche", content: sections.market },
    { id: "fundamentals", label: "Fondamentaux", content: sections.fundamentals },
    { id: "risks", label: "Risques", content: sections.risks },
    { id: "comparison", label: "Comparaison", content: hasComparison ? sections.comparison : "" }
  ].filter((tab) => tab.content && tab.content.trim().length > 0);

  useEffect(() => {
    if (!tabs.find((tab) => tab.id === activeTab)) {
      onTabChange(tabs[0]?.id || "intro");
    }
  }, [activeTab, onTabChange, tabs]);

  return (
    <div className="report-tabs">
      <div className="tablist" role="tablist" aria-label="Sections du rapport">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "tab active" : "tab"}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-panel" role="tabpanel">
        <pre className="report">{tabs.find((tab) => tab.id === activeTab)?.content || ""}</pre>
      </div>
    </div>
  );
}

function splitMarkdownSections(markdown) {
  const lines = markdown.split("\n");
  const metaLine = lines.find((line) => line.startsWith("*Genere le:"));
  const disclaimerLine = lines.find((line) => line.startsWith("> "));

  const sections = {
    intro: "",
    market: "",
    fundamentals: "",
    risks: "",
    comparison: "",
    metaLine: metaLine || "",
    disclaimerLine: disclaimerLine || ""
  };

  let current = "intro";
  const buffer = {
    intro: [],
    market: [],
    fundamentals: [],
    risks: [],
    comparison: []
  };

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      const title = line.slice(3).trim().toLowerCase();
      if (title.startsWith("marche")) current = "market";
      else if (title.startsWith("fondamentaux")) current = "fundamentals";
      else if (title.startsWith("risques")) current = "risks";
      else if (title.startsWith("comparaison")) current = "comparison";
      else current = "intro";
      buffer[current].push(line);
      return;
    }
    buffer[current].push(line);
  });

  sections.intro = buffer.intro.join("\n").trim();
  sections.market = buffer.market.join("\n").trim();
  sections.fundamentals = buffer.fundamentals.join("\n").trim();
  sections.risks = buffer.risks.join("\n").trim();
  sections.comparison = buffer.comparison.join("\n").trim();

  return sections;
}

function buildIntro(sections, meta) {
  const lines = [];
  lines.push("## CryptoSense");
  if (sections.disclaimerLine) {
    lines.push(sections.disclaimerLine);
    lines.push("");
  }
  lines.push("Rapport informatif uniquement. Aucune recommandation.");
  lines.push("");
  lines.push("### Metadonnees");
  if (meta?.generatedAt) {
    lines.push(`- Date: ${meta.generatedAt}`);
  } else if (sections.metaLine) {
    lines.push(`- ${sections.metaLine.replace(/\*/g, "")}`);
  }
  if (meta?.sources?.length) {
    lines.push(`- Sources: ${meta.sources.join(", ")}`);
  }
  return lines.join("\n").trim();
}
