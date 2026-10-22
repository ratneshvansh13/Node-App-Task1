# Simple Node.js App

A task manager built with Node.js and Express: REST API, a small web UI, tests, Docker and CI.

## Project structure

```
simple-node-app/
├── app.js                  # Express app (routes, middleware) - exported for testing
├── server.js               # Starts the HTTP server, handles port errors and shutdown
├── public/
│   └── index.html          # Frontend (served statically)
├── tests/
│   └── api.test.js         # Jest + Supertest API tests
├── .github/workflows/
│   └── ci.yml              # GitHub Actions: test + docker build
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .env.example
└── package.json
```

## Run locally

```bash
npm install
npm start                   # http://localhost:3000
PORT=3001 npm start         # use another port if 3000 is busy
npm run dev                 # auto-restart on file changes
npm test                    # run tests
```

## Run with Docker

```bash
docker build -t simple-node-app .
docker run -p 3000:3000 simple-node-app
```

## API

| Method | Path             | Body                    | Description       |
|--------|------------------|-------------------------|-------------------|
| GET    | /health          |                         | Health check      |
| GET    | /api/tasks       |                         | List all tasks    |
| GET    | /api/tasks/:id   |                         | Get one task      |
| POST   | /api/tasks       | `{ "title": "..." }`    | Create a task     |
| PUT    | /api/tasks/:id   | `{ "title"?, "done"? }` | Update a task     |
| DELETE | /api/tasks/:id   |                         | Delete a task     |

```bash
curl -X POST localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Write tests"}'
curl localhost:3000/api/tasks
curl -X PUT localhost:3000/api/tasks/1 -H "Content-Type: application/json" -d '{"done":true}'
curl -X DELETE localhost:3000/api/tasks/1
```

## Notes

- Data is stored in memory and resets on restart. Swap the `tasks` array in `app.js` for a database (SQLite/MongoDB/PostgreSQL) to persist it.
- `public/index.html` is unchanged from the earlier version and talks to the API with `fetch`.
