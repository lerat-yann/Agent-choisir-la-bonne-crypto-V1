# Product Requirements Document: CryptoSense MVP

## Overview

**Product Name:** CryptoSense  
**Problem Statement:** CryptoSense aide a comprendre, comparer et analyser des crypto-actifs sur le long terme, de maniere structuree, pedagogique et neutre, sans conseil financier.  
**MVP Goal:** Livrer un MVP fonctionnel de demonstration avec architecture propre et integration IA encadree.  
**Target Launch:** ASAP (sprint court, quelques jours)

## Target Users

### Primary User Profile
**Who:** Curieux crypto et investisseurs long terme non experts  
**Problem:** L'information est dispersee, biaisee (hype/trading) ou trop technique pour une comprehension long terme claire et neutre.  
**Current Solution:** Sites d'actualite, videos YouTube, forums  
**Why They'll Switch:** Rapport structure, comparatif, neutre et pedagogique, adapte au niveau

### Secondary User Profile
**Who:** Recruteurs / jurys tech (contexte demo/portfolio)  
**What They Need:** Un produit propre, bien cadre, avec IA encadree et une UX claire

### User Persona: “Alex, curieux long terme”
- **Demographics:** 20-45 ans, France/Europe, interet crypto sans expertise technique forte
- **Tech Level:** Debutant a intermediaire
- **Goals:** Comprendre les actifs long terme et comparer sans biais court terme
- **Frustrations:** Trop de bruit, de jargon, d'opinions non sourcees

## User Journey

### The Story
Alex veut comprendre deux cryptos sur 3-5 ans. Il selectionne les actifs, choisit son niveau, lance l'analyse et recoit un rapport structure avec comparaison et synthese IA encadree.

### Key Touchpoints
1. **Discovery:** Recommandation, portfolio, demo
2. **First Contact:** Page de selection d'actifs et niveau
3. **Onboarding:** Selection + explication rapide de ce qui sera genere
4. **Core Loop:** Generation du rapport long terme
5. **Retention:** Revenir comparer d'autres actifs ou niveaux

## MVP Features

### Core Features (Must Have)

#### 1) Selection de crypto-actifs (1-3)
- **Description:** Permet de choisir les actifs a analyser
- **User Value:** Point d'entree de l'analyse
- **Success Criteria:**
  - L'utilisateur peut selectionner 1 a 3 actifs
  - Le systeme valide les tickers/IDs
  - L'analyse demarre uniquement si selection valide
- **Priority:** Critical

#### 2) Choix du niveau pedagogique
- **Description:** Adapte le vocabulaire et le niveau de detail (debutant/intermediaire/expert)
- **User Value:** Accessibilite pour differents profils
- **Success Criteria:**
  - Le niveau est obligatoire avant generation
  - Le contenu change clairement selon le niveau
  - Les definitions/explications suivent le niveau
- **Priority:** Critical

#### 3) Rapport long terme structure
- **Description:** Presente donnees, fondamentaux, risques, scenarios sur 2-5 ans
- **User Value:** Coeur de la proposition de valeur
- **Success Criteria:**
  - Sections standardisees et completes
  - Donnees factuelles issues de CoinGecko
  - Aucune recommandation d'achat/vente
- **Priority:** Critical

#### 4) Comparaison multi-actifs (si >= 2)
- **Description:** Tableau comparatif factuel
- **User Value:** Comprendre les differences relatives
- **Success Criteria:**
  - Tableau clair et coherent
  - Criteres comparables
  - Section absente si un seul actif
- **Priority:** Critical

#### 5) Synthese IA encadree (Gemini)
- **Description:** Resume le rapport de maniere neutre et pedagogique
- **User Value:** Gain de temps et valeur IA
- **Success Criteria:**
  - Section clairement identifiee comme IA
  - Aucune recommandation financiere
  - Fallback “data-only” si IA indisponible
- **Priority:** Critical

### Future Features (Not in MVP)
| Feature | Why Wait | Planned For |
|---------|----------|-------------|
| Authentification / comptes | Complexite inutile pour demo | Version 2 |
| Alertes / notifications | Non critique | Version 2 |
| SEO avance / marketing | Hors perimetre demo | Version 2 |
| Backtesting / recommandations | Complexite + risque legal | Version 2 |
| News temps reel | Bruit + couts | Version 2 |

## Success Metrics

### Primary Metrics (1 month)
1) **MVP fonctionnel deploye** — livre en production ou staging public
2) **Demonstration sans bug bloquant** — parcours complet sans erreur

### Secondary Metrics (3 months)
- **Feedback qualitatif positif** sur clarte/comprehension
- **Usage demo repete** pour comparer differents actifs

## UI/UX Direction

**Design Feel:** Sobre, clair, pedagogique, neutre

### Key Screens
1) **Selection**
   - Choix actifs (1-3) + niveau
   - CTA “Lancer l'analyse”
2) **Rapport**
   - Sections standardisees
   - Disclaimer visible
3) **Comparaison**
   - Tableau comparatif
   - Accessible si >= 2 actifs

### Design Principles
- Clarite et lisibilite d'abord
- Neutralite visuelle (eviter le sensationnel)
- Hierarchie stricte des sections

## Technical Considerations

**Platform:** Web (React)  
**Backend:** Node.js/Express  
**AI:** Gemini cote serveur  
**Responsive:** Oui, mobile-first  
**Data:** CoinGecko (prix, market cap, volumes, historiques)  
**Database:** Aucune en V1

### Performance Goals
- Temps de generation rapport < 15 s
- Chargement initial page < 3 s

### Security/Privacy
- Cles IA uniquement cote serveur
- Pas de donnees personnelles
- Logs minimaux

### Scalability
- Simple (stateless, sans DB)
- Supporter un faible volume de requetes concurrentes

### Compliance/Legal
- Neutralite stricte
- Pas de conseil financier
- Disclaimer visible dans le rapport

## Constraints & Requirements

### Budget
- Outils / services: 0 EUR / mois (free tiers uniquement)

### Timeline
- Sprint court (quelques jours) pour MVP fonctionnel

### Non-Functional Requirements
- Neutralite et conformite legale
- Robustesse (pas de crash sur entrees invalides)
- Disponibilite raisonnable

## Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| API externe indisponible | Medium | Fallback / message utilisateur clair |
| Derive de l'IA | High | Prompts encadres + filtrage + disclaimer |
| Perception de conseil financier | High | Regles strictes + wording neutre + disclaimer |
| Latence de generation | Medium | Cache leger ou reduction du scope |

## MVP Completion Checklist

### Development Complete
- [ ] Selection actifs + niveau fonctionnels
- [ ] Rapport genere selon le template
- [ ] Comparaison si >= 2 actifs
- [ ] Synthese IA encadree + fallback

### Launch Ready
- [ ] App deployee (staging public OK)
- [ ] Monitoring minimal
- [ ] Disclaimer affiche

### Quality Checks
- [ ] Parcours complet sans bug bloquant
- [ ] Mobile responsive valide
- [ ] Temps de generation < 15 s

## Next Steps

1) Valider ce PRD
2) Rediger le Technical Design Document (Part 3)
3) Mettre en place l'architecture de base
4) Implementer et tester le MVP
5) Deployer et faire une demo

---
*Created: 2026-02-01*  
*Status: Ready for Technical Design*
