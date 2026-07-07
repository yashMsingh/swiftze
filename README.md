
## Local development

Start the FastAPI backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Start the React app:

```bash
npm install
npm run dev
```

The frontend reads from `http://localhost:8000/api` by default. Set `VITE_SWIFTZE_API_BASE_URL` to point at another API.
