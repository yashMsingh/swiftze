# Swiftze Profile API

Local FastAPI backend for the Profile and Settings screens.

## Run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The React app uses `http://localhost:8000/api` by default. Override it with `VITE_SWIFTZE_API_BASE_URL` if needed.
