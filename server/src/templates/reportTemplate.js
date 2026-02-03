export function buildReportMarkdown({ sections, meta }) {
  const disclaimer = "Aucun conseil financier. Rapport informatif uniquement.";
  return [
    "# Rapport CryptoSense",
    "",
    `> ${disclaimer}`,
    "",
    sections?.market || "",
    "",
    sections?.fundamentals || "",
    "",
    sections?.risks || "",
    "",
    sections?.scenarios || "",
    "",
    sections?.comparison || "",
    "",
    sections?.llm || "",
    "",
    `*Genere le: ${meta?.generatedAt || ""}*`
  ].filter(Boolean).join("\n");
}
