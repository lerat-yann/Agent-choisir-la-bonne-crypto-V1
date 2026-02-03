# Tech Stack & Outils
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** Aucune en V1
- **Styling:** CSS modules ou CSS simple
- **APIs:** CoinGecko (market data), Gemini (LLM, backend only)
- **Deploiement:** Vercel (frontend), Render/Railway (backend)

## Commandes (a definir dans package.json)
- `npm run dev`
- `npm run build`
- `npm run start`

## Exemple de composant (React)
```jsx
// components/LevelPicker.jsx
export default function LevelPicker({ value, onChange }) {
  return (
    <div className="level-picker">
      {['debutant','intermediaire','expert'].map((lvl) => (
        <label key={lvl}>
          <input
            type="radio"
            name="level"
            value={lvl}
            checked={value === lvl}
            onChange={(e) => onChange(e.target.value)}
          />
          {lvl}
        </label>
      ))}
    </div>
  );
}
```

## Gestion d'erreur (pattern)
```js
// server/src/routes/report.js
app.post('/api/report', async (req, res) => {
  try {
    const { assets, level } = req.body || {};
    if (!Array.isArray(assets) || assets.length < 1 || assets.length > 3) {
      return res.status(400).json({ error: 'assets invalides' });
    }
    if (!['debutant', 'intermediaire', 'expert'].includes(level)) {
      return res.status(400).json({ error: 'niveau invalide' });
    }
    // ... build report
    return res.json({ reportMarkdown: '...' });
  } catch (err) {
    return res.status(500).json({ error: 'erreur serveur' });
  }
});
```

## Conventions de nommage
- Composants React: PascalCase
- Hooks: useXxx
- Services API: camelCase
- Fichiers: kebab-case ou PascalCase selon usage
