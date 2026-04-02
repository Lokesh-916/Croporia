import streamlit as st
import requests
import pandas as pd

API_URL = "http://localhost:8000/api"

st.set_page_config(page_title="AgriTech Yield Monetizer", page_icon="🌾", layout="wide")

st.title("🌾 AgriTech Yield Monetizer & Crop Exchange")
st.markdown("Optimize your harvest profits and connect directly with local buyers. (Pricing in ₹/Kg)")

# Categorical databases based on user instruction
VEGETABLES = sorted(["Tomato", "Brinjal", "Okra", "Chilli", "Onion", "Potato", "Cauliflower", "Cabbage", "Spinach", "Bitter Gourd", "Bottle Gourd", "Carrot"])
FRUITS = sorted(["Mango", "Banana", "Papaya", "Guava", "Watermelon", "Pomegranate", "Coconut", "Lemon", "Sapota", "Jackfruit"])
CROPS_GRAINS = sorted(["Rice", "Wheat", "Maize", "Groundnut", "Sunflower", "Soybean", "Cotton", "Sugarcane", "Turmeric", "Red Gram", "Blackgram"])

ALL_ITEMS = sorted(VEGETABLES + FRUITS + CROPS_GRAINS)

tab1, tab2 = st.tabs(["Yield Monetizer (Hold/Sell)", "Direct-to-Buyer Exchange"])

# =====================================================================
# TAB 1: Yield Monetizer (Hold/Sell)
# =====================================================================
with tab1:
    st.header("Price Prediction & Storage Strategy")
    st.write("Determine whether to sell your item today or pay to store it for 14 days and sell it later.")
    
    # Dynamic selection logic to keep lists clean
    category = st.radio("Select Category", ["Vegetables", "Fruits", "Crops & Grains"], horizontal=True)
    if category == "Vegetables":
        options = VEGETABLES
    elif category == "Fruits":
        options = FRUITS
    else:
        options = CROPS_GRAINS
        
    with st.form("predict_form"):
        col1, col2, col3 = st.columns(3)
        with col1:
            crop = st.selectbox("Crop/Item", options)
        with col2:
            quantity = st.number_input("Quantity (Kgs)", min_value=1.0, value=100.0, step=10.0)
        with col3:
            storage_cost = st.number_input("Daily Storage Cost (₹ per Kg)", min_value=0.0, value=0.2, step=0.05)
            
        submitted = st.form_submit_button("Analyze Strategy")
        
    if submitted:
        payload = {
            "crop_name": crop,
            "quantity_kgs": quantity,
            "storage_cost_per_day": storage_cost
        }
        try:
            with st.spinner("Analyzing market trends..."):
                response = requests.post(f"{API_URL}/predict-price", json=payload)
                
            if response.status_code == 200:
                data = response.json()
                rec = data["recommendation"]
                
                # Difference metric (Rupees)
                diff = data["future_revenue"] - data["current_revenue"]
                
                st.subheader("Market Recommendation")
                if rec == "HOLD FOR 14 DAYS":
                    st.success(
                        f"📈 **{rec}**: The market trend is rising! Storing your {crop.lower()} will yield an estimated "
                        f"**₹{diff:,.2f}** more in profit even after covering total storage costs "
                        f"(₹{data['total_storage_cost']:,.2f})."
                    )
                else:
                    st.warning(
                        f"📉 **{rec}**: The market trend is dropping or stable! Storing your {crop.lower()} would result in an estimated loss of "
                        f"**₹{abs(diff):,.2f}** compared to selling today. Better to liquidate now."
                    )
                
                m1, m2, m3, m4 = st.columns(4)
                m1.metric("Current Price (per Kg)", f"₹{data['current_price']:,.2f}")
                m2.metric("Projected Price (in 14 days)", f"₹{data['projected_price']:,.2f}", f"{data['trend_slope']:,.2f} slope")
                m3.metric("Current Total Revenue", f"₹{data['current_revenue']:,.2f}")
                m4.metric("Future Net Revenue", f"₹{data['future_revenue']:,.2f}", f"cost: -₹{data['total_storage_cost']:,.2f}")
                
            else:
                st.error(f"Error connecting to prediction API (Code: {response.status_code}).")
        except Exception as e:
            st.error(f"Failed to connect to the backend server. Error: {e}")

# =====================================================================
# TAB 2: Direct-to-Buyer Exchange
# =====================================================================
with tab2:
    st.header("Direct-to-Buyer Exchange Hub")
    
    col_left, col_right = st.columns([1, 1.8])
    
    with col_left:
        st.subheader("Post a New Listing")
        with st.form("listing_form", clear_on_submit=True):
            farmer_name = st.text_input("Farmer/Farm Name")
            crop_name = st.selectbox("Item Listing Type", ALL_ITEMS)
            list_quantity = st.number_input("Quantity Available (Kgs)", min_value=1.0, value=50.0)
            asking_price = st.number_input("Asking Price (₹ per Kg)", min_value=1.0, value=40.0)
            zip_code = st.text_input("Zip Code / Location")
            
            list_submit = st.form_submit_button("Post Listing to Market")
            
        if list_submit:
            if not farmer_name or not zip_code:
                st.error("Please fill in all details (Farmer Name and Zip Code).")
            else:
                post_payload = {
                    "farmer_name": farmer_name,
                    "crop_name": crop_name,
                    "quantity_kgs": list_quantity,
                    "asking_price_per_kg": asking_price,
                    "zip_code": zip_code
                }
                try:
                    res = requests.post(f"{API_URL}/exchange/list", json=post_payload)
                    if res.status_code == 200:
                        st.success("✅ Your listing was created seamlessly!")
                    else:
                        st.error("Failed to post the listing.")
                except Exception as e:
                    st.error(f"Failed to connect to the backend server. {e}")

    with col_right:
        st.subheader("Active Local Listings")
        
        f1, f2 = st.columns([2, 1])
        with f1:
            filter_crop = st.selectbox("Filter Listings by Item", ["All"] + ALL_ITEMS)
        with f2:
            st.write(" ") 
            st.write(" ")
            refresh = st.button("🔄 Refresh Data", use_container_width=True)
            
        try:
            get_url = f"{API_URL}/exchange/listings"
            if filter_crop != "All":
                get_url += f"?crop_filter={filter_crop}"
                
            res_listings = requests.get(get_url)
            
            if res_listings.status_code == 200:
                listings_data = res_listings.json()
                
                if not listings_data:
                    st.info("There are currently no active listings for your search criteria. Be the first to list!")
                else:
                    df = pd.DataFrame(listings_data)
                    df.columns = ["Farmer Name", "Item", "Quantity (Kgs)", "Asking Price (₹/Kg)", "Zip Code"]
                    st.dataframe(df, use_container_width=True, hide_index=True)
            else:
                st.error("Error fetching listings from the backend.")
        except Exception as e:
            st.error(f"Could not load the listings database: {e}")
