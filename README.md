# AI Image Cleaner 🖼️

A web app to remove unwanted objects from images using AI — upload an image, select the object, and let AI reconstruct the background automatically.

## ✨ Features
- Manual brush-based object removal
- Crop tool
- JPG / PNG / WEBP conversion
- Passport-size photo resize (India, US, PAN, Stamp presets)
- AI Auto-Detect — click on detected objects (20 classes) to auto-remove them

## 🧰 Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** HTML, CSS, JavaScript
- **AI/CV:** OpenCV (inpainting), MobileNet-SSD (object detection)

## 🚀 How to Run
1. Clone the repo
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `uvicorn main:app --reload`
4. Open `http://localhost:8000` in your browser

## 📌 Note
Built entirely with free, open-source tools — no paid APIs used.
