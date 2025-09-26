# Plantify API

API REST pour la gestion de plantes

##  Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Documentation API](#documentation-api)
- [Endpoints](#endpoints)
- [Modèles de données](#modèles-de-données)
- [Système de notifications](#système-de-notifications)
- [Scripts disponibles](#scripts-disponibles)

## Description

Plantify est une API REST développée avec NestJS qui permet aux utilisateurs de gérer leurs plantes d'intérieur. L'application offre un système complet de suivi des arrosages avec des rappels automatiques par email.

## Fonctionnalités

### Authentification
- Inscription et connexion utilisateur
- Authentification JWT

### Gestion des plantes
- Création et gestion de plantes
- Suivi des informations détaillées (espèce, date d'achat, image)
- Configuration des besoins en eau personnalisés

### Système d'arrosage
- Enregistrement des arrosages
- Calcul automatique des prochains arrosages
- Historique complet des arrosages

### Notifications automatisées
- Rappels d'arrosage quotidiens (8h00)
- Notifications pour arrosages manqués (17h00)

## Technologies utilisées

- **Framework**: NestJS
- **Base de données**: SQLite avec TypeORM
- **Authentification**: JWT + Passport
- **Validation**: Class Validator
- **Documentation**: Swagger/OpenAPI
- **Tâches planifiées**: NestJS Schedule
- **Email**: Nodemailer
- **Sécurité**: bcryptjs

## 🚀 Installation

### Prérequis
- Node.js (version 18+)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd plantify/backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

4. **Démarrer l'application**
```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_PATH=./data/plant.db

# JWT
JWT_SECRET=votre_secret_jwt_ici

# Email (pour les notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
```

### Configuration de la base de données

L'application utilise SQLite par défaut. La base de données sera créée automatiquement au premier démarrage dans le dossier `data/`.

## Documentation API

Une documentation interactive est disponible à l'adresse :
```
http://localhost:3000/api-docs
```
## Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| POST | `/login` | Connexion utilisateur | Non |
| POST | `/register` | Inscription utilisateur | Non |
| GET | `/profile` | Profil utilisateur | Oui |

### Plantes (`/api/plants`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| POST | `/` | Créer une plante | Oui |
| GET | `/` | Liste des plantes | Oui |
| GET | `/:id` | Détails d'une plante | Oui |

### Arrosage (`/api/watering`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | `/all` | Historique des arrosages | Oui |
| POST | `/plants/:plantId` | Enregistrer un arrosage | Oui |
| GET | `/plants/:plantId` | Historique d'une plante | Oui |

### Rappels (`/api/reminders`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| POST | `/test/watering` | Tester les rappels d'arrosage | Oui |
| POST | `/test/missed` | Tester les rappels manqués | Oui |

### Santé de l'API (`/api`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | `/health` | Statut de l'API | Non |

## Modèles de données

### User (Utilisateur)
```typescript
{
  id: number;
  email: string;
  name: string;
  password: string; // hashé
  createdAt: Date;
  updatedAt: Date;
  plants: Plant[];
}
```

### Plant (Plante)
```typescript
{
  id: number;
  userId: number;
  name: string;
  species?: string;
  imageUrl?: string;
  purchaseDate: Date;
  waterAmount: number; // en ml
  wateringFrequency: number; // en jours
  lastWateredAt?: Date;
  nextWateringDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  wateringRecords: WateringRecord[];
}
```

### WateringRecord (Enregistrement d'arrosage)
```typescript
{
  id: number;
  plantId: number;
  userId: number;
  wateredAt: Date;
  waterAmount: number; // en ml
  createdAt: Date;
}
```

## Système de notifications

### Rappels automatiques

L'application envoie automatiquement des emails :

1. **Rappels d'arrosage** : Tous les jours à 8h00
   - Vérifie les plantes nécessitant un arrosage
   - Envoie un email à l'utilisateur

2. **Rappels d'arrosages manqués** : Tous les jours à 17h00
   - Vérifie les plantes non arrosées depuis plus de 1 jour
   - Envoie un email de rappel

### Configuration email

Pour activer les notifications, configurez les variables d'environnement email dans votre fichier `.env`.

## 🚀 Scripts disponibles

```bash
# Développement
npm run start:dev          # Démarrage avec rechargement automatique
npm run start:debug        # Démarrage en mode debug

# Production
npm run build             # Compilation TypeScript
npm run start:prod        # Démarrage en production

# Tests
npm run test              # Tests unitaires
npm run test:watch        # Tests en mode watch
npm run test:cov          # Tests avec couverture
npm run test:e2e          # Tests end-to-end

# Qualité du code
npm run lint              # Linting ESLint
npm run format            # Formatage Prettier
```

##  Sécurité

- **Authentification JWT** avec expiration de 24h
- **Hachage des mots de passe** avec bcrypt (12 rounds)
- **Validation des données** avec class-validator
- **CORS configuré** pour le frontend
- **Filtres d'exception globaux** pour la gestion d'erreurs

## Fonctionnalités avancées

### Calcul automatique des arrosages
- Calcul automatique de la prochaine date d'arrosage
- Prise en compte de la fréquence personnalisée
- Mise à jour automatique après chaque arrosage

### Système de rappels intelligent
- Détection automatique des plantes nécessitant un arrosage
- Gestion des arrosages manqués

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

##  Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

##  Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository GitHub.

---

**Développé avec ❤️ pour les amoureux des plantes** 
