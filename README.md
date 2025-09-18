# 🏥 Medical Report Analyzer

## 📌 Overview
This project extracts and summarizes medical reports from uploaded PDF files.  
It combines a **FastAPI backend** for PDF text extraction with a **React frontend** powered by **Google Gemini AI** for generating medical summaries.  

Users can upload medical report PDFs, view the extracted text, and get a structured AI-generated summary of conditions, diagnosis, and treatment plans.  

---

## ✨ Features
- 📄 Upload and process medical report PDFs  
- 🔍 Extract raw text using **pdfplumber** (FastAPI backend)  
- 🤖 Summarize reports using **Google Gemini AI**  
- 🎨 Clean UI built with React + custom CSS  
- 🌐 CORS-enabled backend for frontend integration  

---

## 🗂 Project Structure

```bash
medical-report-analyzer/
│
├── backend/                  # Backend service built with FastAPI
│   ├── main.py               # API for PDF text extraction using pdfplumber
│   └── requirements.txt      # Python dependencies for backend
│
├── frontend/                 # Frontend application built with React
│   ├── ocr.jsx               # Main React component for file upload & AI summary
│   ├── ocr.css               # Styling for the OCR component
│   └── package.json          # Node.js dependencies for frontend
│
├── .gitignore                # Specifies files/folders to be ignored by Git
└── README.md                 # Project documentation
