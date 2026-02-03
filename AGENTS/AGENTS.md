# AGENTS.md — Plan Directeur pour CryptoSense

## Apercu du projet
**App:** CryptoSense
**But:** Comprendre, comparer et analyser des crypto-actifs long terme de maniere structuree, pedagogique et neutre, sans conseil financier.
**Stack:** React (Vite) + Node.js/Express + CoinGecko + Gemini (backend only) + sans DB
**Phase actuelle:** Phase 1 — Foundation

## Comment je dois raisonner
1. **Comprendre l'intention d'abord**: Identifier le besoin reel avant de repondre
2. **Demander si incertain**: Poser une question si une info critique manque
3. **Planifier avant de coder**: Proposer un plan, demander validation, puis executer
4. **Verifier apres changements**: Lancer tests/linters ou checks manuels
5. **Expliquer les compromis**: Donner alternatives et limites

## Plan → Executer → Verifier
1. **Plan:** Proposer une approche breve et demander accord
2. **Plan Mode:** Utiliser un mode Plan/Reflect si disponible
3. **Executer:** Une feature a la fois
4. **Verifier:** Tests/linters/checks manuels apres chaque feature

## Contexte & Memoire
- AGENTS/AGENTS.md et AGENTS/agent_docs/ sont vivants
- Les configs outillent la memoire projet
- Mettre a jour quand l'architecture evolue

## Roles optionnels (si supportes)
- **Explorer:** scanner le code/doc en parallele
- **Builder:** implementer une feature approuvee
- **Tester:** verifier et rapporter les erreurs

## Tests & Verification
- Suivre AGENTS/agent_docs/testing.md
- Si pas de tests, proposer des checks manuels
- Ne pas avancer si verif echoue

## Checkpoints & Pre-Commit
- Creer des checkpoints apres jalons
- Ne pas bypass les hooks si presents

## Fichiers de contexte
- `AGENTS/agent_docs/tech_stack.md`
- `AGENTS/agent_docs/code_patterns.md`
- `AGENTS/agent_docs/project_brief.md`
- `AGENTS/agent_docs/product_requirements.md`
- `AGENTS/agent_docs/testing.md`

## Etat actuel (a maintenir)
**Derniere mise a jour:** 2026-02-01
**En cours:** Generation des fichiers d'instructions AGENTS
**Dernier terminee:** PRD et Tech Design
**Bloque par:** Aucun

## Roadmap
### Phase 1: Foundation
- [ ] Initialiser le projet
- [ ] Configurer les scripts de base
- [ ] Definir le template de rapport

### Phase 2: Core Features
- [ ] Selection d'actifs (1-3)
- [ ] Choix du niveau pedagogique
- [ ] Rapport long terme structure
- [ ] Comparaison multi-actifs
- [ ] Synthese IA encadree

## Ce qu'il ne faut PAS faire
- Ne pas supprimer de fichiers sans confirmation
- Ne pas ajouter de features hors scope
- Ne pas contourner des tests/hook fails
- Ne pas introduire de DB en V1
- Ne pas donner de conseil financier

## Contrainte principale d'agent
- L'agent principal d'implementation est l'IA de ce chat. VS Code + Copilot est uniquement l'IDE.
