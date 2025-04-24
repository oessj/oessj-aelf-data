# OESSJ AELF Data

Ce dépôt contient des données liturgiques prétraitées depuis l'API AELF pour l'application OESSJ.

## Fonctionnement

1. Un script Node.js récupère quotidiennement les données de l'API AELF
2. Les données sont simplifiées et nettoyées
3. Les données sont stockées au format JSON
4. Les données sont accessibles via GitHub Pages

## Structure des données

Les données sont organisées par office liturgique :

- `data/laudes/` - Données pour les Laudes
- `data/complies/` - Données pour les Complies
- `data/vepres/` - Données pour les Vêpres
- `data/messe/` - Données pour la Messe
- `data/tierce/` - Données pour Tierce
- `data/sexte/` - Données pour Sexte
- `data/none/` - Données pour None
- `data/lectures/` - Données pour l'Office des Lectures

Pour chaque office, vous trouverez :

- `latest.json` - Les dernières données disponibles
- `YYYY-MM-DD.json` - Données pour une date spécifique

## Utilisation dans l'application OESSJ

Pour utiliser ces données dans l'application OESSJ, créez un service qui récupère les données depuis GitHub Pages :

```javascript
const GITHUB_BASE_URL = '[https://oessj.github.io/oessj-aelf-data';](https://oessj.github.io/oessj-aelf-data';)

export const getLaudes = async () => {
  try {
    const response = await fetch(`${GITHUB_BASE_URL}/data/laudes/latest.json`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans getLaudes:', error);
    throw new Error('Impossible de récupérer les Laudes');
  }
};
