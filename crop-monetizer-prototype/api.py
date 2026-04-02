from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    crop_name: str
    quantity_kgs: float
    storage_cost_per_day: float

class CropListing(BaseModel):
    farmer_name: str
    crop_name: str
    quantity_kgs: float
    asking_price_per_kg: float
    zip_code: str

db_listings = []

# Base approximations of current market scenario prices (₹ per Kg) in India, 2026.
CROP_PRICES_KG = {
    # Vegetables
    "tomato": 35.0, "brinjal": 30.0, "okra": 40.0, "chilli": 60.0, "onion": 30.0,
    "potato": 25.0, "cauliflower": 45.0, "cabbage": 30.0, "spinach": 20.0, 
    "bitter gourd": 50.0, "bottle gourd": 25.0, "carrot": 40.0,
    # Fruits
    "mango": 80.0, "banana": 40.0, "papaya": 30.0, "guava": 50.0, "watermelon": 20.0,
    "pomegranate": 120.0, "coconut": 40.0, "lemon": 60.0, "sapota": 40.0, "jackfruit": 30.0,
    # Crops
    "rice": 50.0, "wheat": 30.0, "maize": 25.0, "groundnut": 80.0, "sunflower": 90.0,
    "soybean": 55.0, "cotton": 100.0, "sugarcane": 5.0, "turmeric": 150.0, 
    "red gram": 120.0, "blackgram": 110.0
}

def get_mock_price_data(crop: str) -> pd.DataFrame:
    """ Generate 30 days of pseudo-realistic wholesale prices around the current market baseline """
    np.random.seed(42) # Fixed seed for stable prototype demonstrations
    dates = pd.date_range(end=pd.Timestamp.today(), periods=30)
    base_price = CROP_PRICES_KG.get(crop.lower(), 50.0) 
    
    # Generate prices using a random walk slightly trending upwards
    trend = np.linspace(base_price * 0.9, base_price * 1.1, 30)
    prices = trend + np.random.normal(0, base_price * 0.05, 30)
    
    df = pd.DataFrame({
        'date': dates,
        crop: prices
    })
    return df

@app.post("/api/predict-price")
async def predict_price(payload: PredictionRequest):
    crop = payload.crop_name.lower().strip()
    
    if crop not in CROP_PRICES_KG:
        raise HTTPException(
            status_code=400, 
            detail=f"Crop '{payload.crop_name}' not supported. Please select from the supported database."
        )
    
    df = get_mock_price_data(crop)
    
    # 7-day Simple Moving Average (SMA)
    sma_7_days = df[crop].rolling(window=7).mean()
    last_7_sma = sma_7_days.tail(7).dropna().values
    
    if len(last_7_sma) < 2:
        slope = 0.0
    else:
        # Differences over the available SMA window
        slope = (last_7_sma[-1] - last_7_sma[0]) / (len(last_7_sma) - 1)
        
    current_price = df[crop].iloc[-1]
    
    # Project 14 days into the future and limit it to not fall below 0
    projected_price = max(current_price + (slope * 14), 0.0)
    
    # Unit conversions (Calculations per Kg)
    current_revenue = current_price * payload.quantity_kgs
    total_storage_cost = payload.storage_cost_per_day * 14 * payload.quantity_kgs
    future_revenue = (projected_price * payload.quantity_kgs) - total_storage_cost
    
    if future_revenue > current_revenue:
        recommendation = "HOLD FOR 14 DAYS"
    else:
        recommendation = "SELL NOW"

    return {
        "crop_name": payload.crop_name,
        "current_price": round(current_price, 2),
        "projected_price": round(projected_price, 2),
        "trend_slope": round(slope, 2),
        "current_revenue": round(current_revenue, 2),
        "total_storage_cost": round(total_storage_cost, 2),
        "future_revenue": round(future_revenue, 2),
        "recommendation": recommendation
    }

@app.post("/api/exchange/list")
async def create_listing(listing: CropListing):
    db_listings.append(listing)
    return {"message": "Listing created successfully!"}

@app.get("/api/exchange/listings")
async def get_listings(crop_filter: Optional[str] = None):
    if crop_filter and crop_filter != "All":
        filtered = [item for item in db_listings if item.crop_name.lower() == crop_filter.lower()]
        return filtered
    return db_listings
