# OBITUARY APP

This Mini Project Leverages React _(with Vite Build tool)_ for the Frontend side and a slim Express Backend Server. I chose to have JS all through _(including the backend)_ due to my farmiliarity to JS - **though I do plan on having a git branch to implement the same with Laravel as a learning exercise.**

Due to the simplicity of the project, I decided on using SQLite as the Database due to its simplicity of use:
1. It doesn't require credentials hence there is not much ceremony when it comes to database connections.
2. The entire database is a single `.db` file that can live together with the repository
3. Below is the schema I settled on

```sql
CREATE TABLE IF NOT EXISTS obituaries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         VARCHAR(255) NOT NULL,
  born_at      VARCHAR(10) NOT NULL,   -- 'YYYY-MM-DD'
  died_at      VARCHAR(10) NOT NULL,
  content      TEXT NOT NULL,
  author       VARCHAR(255) NOT NULL,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  slug         VARCHAR(255) UNIQUE NOT NULL
);
```

## INSTRUCTIONS TO RUN LOCALLY

#### 1. Clone The Repository
```shell
git clone https://github.com/CypherWhisperer/SimpleObituaryApp
```
#### 2. Install Backend (Server) Dependencies And run server _(Express)._

```shell
cd SimpleObituaryApp/server
```

```shell
npm install && node index.js
```

#### 3. Install Frontend (Client) Dependencies And run Client Server _(Vite)._

From `server/`:
```shell
cd ../client
```

OR From Repository Root _(`SimpleObituaryApp/`):_
```shell
cd client
```

Run The Server
```shell
npm install && npm run dev
```

#### 4. Access The Page from browser

```
http://localhost:5173
```
## REPOSITORY TREE STRUCTURE


```

obituary-app/
├── server/
│   ├── db/
│   │   ├── obituary_app.db        ← the SQLite file itself, git-ignored
│   │   └── schema.sql             ← run once (via sqlit3 or node) to init the file
│   ├── routes/
│   │   └── obituaries.js          ← GET (list, paginated) / POST (create) handlers
│   ├── lib/
│   │   └── slugify.js             ← name -> "john-doe-<id>" generation
│   ├── index.js                   ← express() setup, mounts routes, db.listen()
│   └── package.json
│
└── client/                        ←  React
    ├── src/
    │   ├── assets/
    │   │   ├── hooks/
    │   │   │   └── useObituaries.js   ← fetch + pagination state, talks to the API
    │   │   ├── styles/
    │   │   │   └── tokens.css         ← your light/dark tables from DevLog, as CSS vars
    │   │   ├── icons/
    │   │   │   └── index              ← barrel
    │   │   └── fonts/
    │   │       ├── index.css
    │   │       ├── space-grotesk/
    │   │       │   └── space-grotesk.css
    │   │       └── inter/
    │   │           └── inter.css
    │   ├── components/
    │   │   └── obituary/
    │   │       ├── ObituaryCard.jsx
    │   │       ├── ObituaryForm.jsx
    │   │       ├── PaginationControls.jsx
    │   │       └── index.js       ← barrel
    │   ├── pages/
    │   │   ├── ObituaryList.jsx   ← the default/with-entries screen
    │   │   ├── SubmitObituary.jsx ← the form screen
    │   │   └── index.js
    │   ├── index.css
    │   ├── main.jsx
    │   └── App.jsx
    ├── index.html                 ← page entry point.
    ├── vite.config.js             ← proxies /api to the Express server in dev
    ├── jsconfig.json
    └── package.json
```
