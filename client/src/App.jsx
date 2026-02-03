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
  const [includeLlm, setIncludeLlm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

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
          LLM_ADVISORY: includeLlm
        }
      };
      const data = await requestReport(payload);
      setReport(data);
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
        <h1>CryptoSense</h1>
        <p>Analyse long terme, claire et neutre. Aucun conseil financier.</p>
      </header>

      <main className="main">
        <section className="card">
          <h2>Selection</h2>
          <p>Choisissez 1 a 3 actifs et un niveau.</p>
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
              {suggestLoading && <small>Recherche...</small>}
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
            <div className="field inline">
              <input
                id="llm"
                type="checkbox"
                checked={includeLlm}
                onChange={(event) => setIncludeLlm(event.target.checked)}
              />
              <label htmlFor="llm">Inclure synthese IA (Gemini)</label>
            </div>
            <button className="primary" disabled={!canSubmit || loading}>
              {loading ? "Generation..." : "Lancer l'analyse"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="card">
          <h2>Rapport</h2>
          {!report && !loading && (
            <p>Le rapport s'affichera ici apres generation.</p>
          )}
          {loading && <div className="placeholder">Generation en cours...</div>}
          {report && (
            <>
              {report.meta?.fallback && (
                <p className="warning">Fallback data-only actif (LLM indisponible).</p>
              )}
              <pre className="report">{report.reportMarkdown}</pre>
              {report.sections?.comparison && assets.length >= 2 ? (
                <p className="note">Section comparaison incluse.</p>
              ) : (
                <p className="note">Comparaison masquee (moins de 2 actifs).</p>
              )}
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
