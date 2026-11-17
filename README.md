# Portfolio Manager 💼📈

Application full-stack moderne de suivi d'actifs financiers, de gestion de transactions et de suivi d'objectifs d'épargne et d'investissement.

---

## 🏗️ Architecture & Stack Technique

Le projet repose sur une architecture découplée assurant modularité, performance asynchrone et maintenabilité :

### Backend
- **Framework :** Python 3.11+ / [FastAPI](https://fastapi.tiangolo.com/) (Asynchrone)
- **Base de données & ORM :** [SQLAlchemy 2.0 Async](https://docs.sqlalchemy.org/) avec SQLite (développement) / PostgreSQL (production)
- **Migrations :** [Alembic](https://alembic.sqlalchemy.org/)
- **Sécurité :** Authentification JWT (`python-jose`), hachage des mots de passe avec `bcrypt`
- **Validation des données :** Pydantic v2
- **Gestionnaire de dépendances :** Poetry

### Frontend
- **Framework :** React 18 / TypeScript
- **Bundler :** Vite
- **Styling :** Tailwind CSS
- **Tests E2E :** Playwright

### DevOps & Qualité
- **Tests unitaires & asynchrones :** `pytest`, `pytest-asyncio`, `httpx`
- **Intégration continue :** GitHub Actions CI (vérification automatique du build et exécution des tests Pytest)

---

## 📂 Structure du Répertoire

```text
portfolio-manager/
├── backend/              # Code source de l'API FastAPI
│   ├── api/              # Routeurs d'authentification, transactions, catégories
│   ├── core/             # Configuration, sécurité JWT, base de données
│   ├── models/           # Modèles SQLAlchemy 2.0 Async
│   └── schemas/          # Schémas Pydantic de validation
├── frontend/             # Application React + TypeScript (Vite)
├── tests/                # Suite de tests unitaires et d'intégration Pytest
├── alembic/              # Scripts de migration de base de données
├── .github/workflows/    # Pipeline CI/CD GitHub Actions
└── pyproject.toml        # Dépendances Poetry
```

---

## 🚀 Installation & Lancement en Local

### Prérequis
- Python 3.11+
- [Poetry](https://python-poetry.org/)
- Node.js 18+ & npm

### 1. Démarrer le Backend

```bash
# Installer les dépendances
poetry install

# Appliquer les migrations de base de données
poetry run alembic upgrade head

# Lancer la suite de tests automatisés
poetry run pytest

# Démarrer le serveur de développement
poetry run uvicorn backend.main:app --reload
```
L'API interactive Swagger est accessible sur `http://localhost:8000/docs`.

### 2. Démarrer le Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur Vite
npm run dev
```
L'interface utilisateur est accessible sur `http://localhost:5173`.

---

## 🧪 Tests

```bash
# Exécuter les tests backend avec Pytest
poetry run pytest -v
```

---

## 👤 Auteur

**Stéphane Nathanaël MARE**  
- GitHub : [@Nathan06-hub](https://github.com/Nathan06-hub)  
- Email : [marenathanael06@gmail.com](mailto:marenathanael06@gmail.com)  
- Formation : Élève-Ingénieur des Travaux en Informatique — UTM Ouagadougou
