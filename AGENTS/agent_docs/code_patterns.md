# Code Patterns

## Structure projet cible
```
cryptosense/
  client/
    src/
      components/
      pages/
      services/
      styles/
      App.jsx
  server/
    src/
      routes/
      services/
      adapters/
      templates/
      app.js
  README.md
```

## Pattern API
- Route: valide input -> appelle service -> renvoie JSON
- Service: logique metier et appels externes
- Adapter: API externes (CoinGecko, Gemini)

## Prompt LLM (guardrails)
- Interdictions: pas de conseil financier, pas de recommandations
- Sortie: synthese courte, neutre, conditionnelle
- Fallback: data-only si erreur
