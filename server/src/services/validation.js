const LEVELS = ["debutant", "intermediaire", "expert"];
const PERIODS = ["2a", "3a", "5a"];

export function validateReportRequest(payload) {
  const errors = [];
  const body = payload && typeof payload === "object" ? payload : {};

  const objectif = typeof body.OBJECTIF === "string" && body.OBJECTIF.trim()
    ? body.OBJECTIF.trim()
    : "analyse_long_terme";

  const niveauRaw = typeof body.NIVEAU === "string" ? body.NIVEAU.trim().toLowerCase() : "";
  if (!niveauRaw) {
    errors.push("NIVEAU est requis.");
  } else if (!LEVELS.includes(niveauRaw)) {
    errors.push(`NIVEAU invalide. Attendu: ${LEVELS.join(", ")}.`);
  }

  const assetsRaw = Array.isArray(body.ASSETS) ? body.ASSETS : null;
  if (!assetsRaw) {
    errors.push("ASSETS doit etre un tableau.");
  }
  const assets = (assetsRaw || [])
    .map((asset) => (typeof asset === "string" ? asset.trim().toUpperCase() : ""))
    .filter(Boolean);
  if (assets.length < 1 || assets.length > 3) {
    errors.push("ASSETS doit contenir 1 a 3 elements.");
  }
  const invalidAssets = assets.filter((asset) => !/^[A-Z0-9]{2,15}$/.test(asset));
  if (invalidAssets.length) {
    errors.push(`ASSETS invalide(s): ${invalidAssets.join(", ")}.`);
  }

  const periode = typeof body.PERIODE === "string" && body.PERIODE.trim()
    ? body.PERIODE.trim()
    : "5a";
  if (!PERIODS.includes(periode)) {
    errors.push(`PERIODE invalide. Attendu: ${PERIODS.join(", ")}.`);
  }

  const includeRaw = body.INCLUDE && typeof body.INCLUDE === "object" ? body.INCLUDE : {};
  const include = {
    NEWS: Boolean(includeRaw.NEWS) || false,
    CHARTS: includeRaw.CHARTS === undefined ? true : Boolean(includeRaw.CHARTS),
    COMPARE: includeRaw.COMPARE === undefined ? true : Boolean(includeRaw.COMPARE),
    LLM_ADVISORY: includeRaw.LLM_ADVISORY === undefined ? false : Boolean(includeRaw.LLM_ADVISORY)
  };

  if (errors.length) {
    return { errors };
  }

  return {
    value: {
      OBJECTIF: objectif,
      NIVEAU: niveauRaw,
      ASSETS: assets,
      PERIODE: periode,
      INCLUDE: include
    }
  };
}
