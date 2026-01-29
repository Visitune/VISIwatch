# VISIwatch AI - Documentation Technique

## Méthodes d'Extraction des Flux (Data Ingestion)

Cette application utilise une architecture d'agrégation de données **100% Client-Side** (sans backend). Pour contourner les restrictions de sécurité des navigateurs (CORS) et unifier les formats de données hétérogènes, nous utilisons plusieurs stratégies.

### 1. Sources de Données

Les sources sont définies dans `services/externalDataService.ts`.

| Source | Type | Endpoint / Méthode |
|--------|------|-------------------|
| **RappelConso** | API REST | `data.economie.gouv.fr/api/explore/v2.1` |
| **OpenFDA** | API REST | `api.fda.gov/food/enforcement` |
| **LégiFrance** | RSS | Via `legifrss.org` (Agrégateur) |
| **RASFF** | RSS | `webgate.ec.europa.eu` |
| **Presse** | RSS | Divers (FoodSafetyNews, etc.) |

### 2. Stratégies de Contournement CORS

Pour récupérer les flux RSS tiers depuis le navigateur, l'application utilise une stratégie de "Course de Proxys" (Race Strategy).

#### A. Méthode `fetchRSSViaJSON` (Prioritaire pour LégiFrance)
Utilise l'API `rss2json.com` pour convertir le XML en JSON.
*   **Avantage :** Très fiable, évite le parsing XML manuel, pas de problèmes d'encodage.
*   **Utilisation :** Prioritaire pour `LEGIFRANCE` car le flux `legifrss.org` est parfois mal interprété par les parsers XML stricts.

#### B. Méthode `fetchRSS` (Proxy Race)
Lance 3 requêtes simultanées vers des proxys CORS publics. Le premier qui répond gagne (`Promise.any`).
1.  `api.allorigins.win`
2.  `corsproxy.io`
3.  `thingproxy.freeboard.io`

Le résultat est ensuite parsé via `DOMParser` (XML).

### 3. Filtrage Intelligent (Smart Filtering)

Pour garantir la pertinence métier, un post-traitement est appliqué, particulièrement sur le flux LégiFrance qui contient tous les textes de loi.

**Logique de Filtrage (`KEYWORDS_AGRO`) :**
Le système analyse le titre et le résumé de chaque article. L'article est conservé uniquement s'il contient l'un des mots-clés suivants :
*   `aliment`, `agri`, `pêche`, `sanitaire`, `hygiène`
*   `santé`, `consom`, `fraude`, `veterinaire`
*   `eau`, `environnement`, `bio`, `durable`
*   `aoc`, `aop`, `label`, `additif`, `emballage`
*   `bactérie`, `lait`, `viande`, `vin`, etc.

### 4. Classification des Risques (IA Symbolique)

Le niveau de risque (`RiskLevel`) est déterminé par une analyse heuristique par mots-clés (Regex) :
*   **CRITICAL :** Présence de termes comme `listeria`, `salmonella`, `mort`, `recall`, `danger`.
*   **HIGH :** `allergène`, `toxin`, `glass`, `metal`.
*   **MEDIUM :** `hygiène`, `qualité`, `inspection`.
*   **LOW :** `décret`, `loi`, `jorf` (Information réglementaire pure).

---
© 2024 VISIwatch AI