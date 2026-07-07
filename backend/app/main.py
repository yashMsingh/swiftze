from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title="Swiftze Profile API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"


profile_state: dict[str, Any] = {
    "user": {
        "id": "1234567",
        "full_name": "Catherine Ojong",
        "email": "catherineojong002@gmail.com",
        "phone": "+292 6272 6272 813",
    },
    "profile": {
        "id": "profile-1234567",
        "user_id": "1234567",
        "full_name": "Catherine Ojong",
        "email": "catherineojong002@gmail.com",
        "phone": "+292 6272 6272 813",
        "nationality": "Nigeria",
        "location": "UAE",
        "city": "California",
    },
    "driver": {
        "id": "driver-1234567",
        "average_rating": 3.5,
        "total_reviews": 650,
        "current_location": {
            "country": "UAE",
            "city": "California",
        },
        "vehicle_details": {
            "make": "Lexus",
            "model": "RX 350",
            "year": "2020",
            "plate_number": "9FQG766",
        },
    },
    "vehicles": [
        {
            "id": "vehicle-001",
            "make": "Lexus",
            "model": "RX 350",
            "year": "2020",
            "plate_number": "9FQG766",
            "is_primary": True,
            "is_active": True,
            "images": [],
        }
    ],
}

email_preferences: dict[str, bool] = {
    "new_orders": True,
    "payment_notifications": False,
    "order_updates": True,
}

ratings = [
    {
        "id": "rating-001",
        "user_name": "Daniel Okafor",
        "rating": 3.5,
        "comment": "The tailor was super professional, delivered my custom suit on time, and the fit was perfect. Highly recommended!.",
        "created_at": "2026-01-13T10:00:00Z",
    },
    {
        "id": "rating-002",
        "user_name": "Maya Patel",
        "rating": 4,
        "comment": "Clear communication and quick delivery updates throughout the trip.",
        "created_at": "2026-01-11T12:45:00Z",
    },
    {
        "id": "rating-003",
        "user_name": "Aisha Bello",
        "rating": 5,
        "comment": "Reliable pickup timing and careful handling.",
        "created_at": "2026-01-09T08:20:00Z",
    },
]


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    location: str | None = None
    preferences: dict[str, Any] = Field(default_factory=dict)


class EmailPreferencesUpdate(BaseModel):
    new_orders: bool | None = None
    payment_notifications: bool | None = None
    order_updates: bool | None = None


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Auth — Login
# ---------------------------------------------------------------------------
# Accepted credentials match the seeded user in profile_state.
# In a real deployment this would verify a hashed password from a database.
VALID_CREDENTIALS: dict[str, str] = {
    "catherineojong002@gmail.com": "swiftze123",
}


@app.post("/api/auth/login")
def login(payload: LoginRequest) -> dict[str, Any]:
    stored_password = VALID_CREDENTIALS.get(payload.email.lower().strip())
    if stored_password is None or stored_password != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = profile_state["user"]
    return {
        "access_token": f"local-token-{user['id']}",
        "token_type": "bearer",
        "user": user,
    }


@app.get("/api/auth/me")
def get_current_user() -> dict[str, Any]:
    return profile_state["user"]


@app.get("/api/profile/getuserprofile")
def get_user_profile() -> dict[str, Any]:
    return profile_state["profile"]


@app.put("/api/profile/update")
def update_user_profile(payload: ProfileUpdate) -> dict[str, Any]:
    profile = profile_state["profile"]
    user = profile_state["user"]

    if payload.full_name:
        profile["full_name"] = payload.full_name
        user["full_name"] = payload.full_name

    if payload.location:
        profile["location"] = payload.location

    email = payload.preferences.get("email")
    if email:
        profile["email"] = email
        user["email"] = email

    phone = payload.preferences.get("phone")
    if phone:
        profile["phone"] = phone
        user["phone"] = phone

    nationality = payload.preferences.get("nationality")
    if nationality:
        profile["nationality"] = nationality

    return profile


@app.get("/api/drivers/profile/me")
def get_driver_profile() -> dict[str, Any]:
    return profile_state["driver"]


@app.get("/api/vehicles/my")
def get_my_vehicles(
    page: int = 1,
    page_size: int = 20,
    is_active: bool = True,
) -> dict[str, Any]:
    vehicles = [
        vehicle
        for vehicle in profile_state["vehicles"]
        if not is_active or vehicle.get("is_active")
    ]
    start = max(page - 1, 0) * page_size
    end = start + page_size
    return {
        "data": vehicles[start:end],
        "page": page,
        "page_size": page_size,
        "total": len(vehicles),
    }


@app.get("/api/orders-comprehensive/email-preferences")
def get_email_preferences() -> dict[str, bool]:
    return email_preferences


@app.put("/api/orders-comprehensive/email-preferences")
def update_email_preferences(payload: EmailPreferencesUpdate) -> dict[str, bool]:
    updates = payload.model_dump(exclude_none=True)
    email_preferences.update(updates)
    return email_preferences


@app.post("/api/uploads/upload-profile-image")
async def upload_profile_image(file: UploadFile = File(...)) -> dict[str, Any]:
    return await save_upload(file, "profile")


@app.post("/api/uploads/vehicles/{vehicle_id}/upload-image")
async def upload_vehicle_image(vehicle_id: str, file: UploadFile = File(...)) -> dict[str, Any]:
    upload = await save_upload(file, f"vehicles/{vehicle_id}")

    for vehicle in profile_state["vehicles"]:
        if vehicle["id"] == vehicle_id:
            vehicle.setdefault("images", []).append(upload)
            break

    return upload


@app.get("/api/interactions/ratings/{entity_type}/{entity_id}")
def get_entity_ratings(
    entity_type: str,
    entity_id: str,
    limit: int = 20,
    offset: int = 0,
) -> list[dict[str, Any]]:
    del entity_type, entity_id
    return ratings[offset : offset + limit]


@app.get("/api/interactions/ratings/{entity_type}/{entity_id}/stats")
def get_rating_stats(entity_type: str, entity_id: str) -> dict[str, Any]:
    del entity_type, entity_id

    breakdown = {str(star): 0 for star in range(1, 6)}
    for rating in ratings:
        star = max(1, min(5, round(rating["rating"])))
        breakdown[str(star)] += 1

    average = sum(rating["rating"] for rating in ratings) / len(ratings)
    return {
        "total_reviews": len(ratings),
        "average_rating": round(average, 1),
        "rating_breakdown": breakdown,
    }


async def save_upload(file: UploadFile, folder: str) -> dict[str, Any]:
    target_dir = UPLOAD_DIR / folder
    target_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename or "").suffix
    stored_name = f"{uuid4().hex}{suffix}"
    target_path = target_dir / stored_name
    content = await file.read()
    target_path.write_bytes(content)

    return {
        "id": uuid4().hex,
        "filename": file.filename,
        "stored_name": stored_name,
        "content_type": file.content_type,
        "size": len(content),
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
