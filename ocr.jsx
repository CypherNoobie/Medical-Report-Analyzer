"use client"

import { useState } from "react"
import axios from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai"
import "./ocr.css"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyBqVOV8quNcRTp03PgY7IjOmVsjHhDpEd8")

const OCR = () => {
  const [pdfText, setPdfText] = useState("")
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState("")

  // Function to send extracted text to Gemini API
  const summarizeMedicalReport = async (reportText) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const prompt = `Looking at the following text, summarize the conditions, diagnosis, and recommended treatment plan for the patient:\n\n${reportText}`

      const result = await model.generateContent(prompt)
      return result.response.text() // AI-generated summary
    } catch (error) {
      console.error("Error generating summary:", error)
      return "I'm sorry, but I couldn't process the medical report."
    }
  }

  // Handle file upload and extract text
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)
    setError("")
    setPdfText("")
    setSummary("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Step 1: Extract text from PDF (via FastAPI backend)
      const response = await axios.post("http://127.0.0.1:8000/extract-text/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.data.error) {
        setError(response.data.error)
        setLoading(false)
        return
      }

      const extractedText = response.data.text
      setPdfText(extractedText)

      // Step 2: Summarize the extracted text using Gemini API
      const summaryText = await summarizeMedicalReport(extractedText)
      setSummary(summaryText)
    } catch (err) {
      setError("Error processing the PDF.")
    }

    setLoading(false)
  }

  return (
    <div className="ocr-container">
      <header className="ocr-header">
        <h1>Medical Report Analyzer</h1>
        <p className="subtitle">Upload a medical report PDF to extract and summarize key information</p>
      </header>

      <div className="upload-section">
        <div className="file-upload">
          <label htmlFor="pdf-upload" className="file-label">
            <span className="upload-icon">📄</span>
            <span>Choose PDF File</span>
          </label>
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="file-input"
          />
          {fileName && <div className="file-name">{fileName}</div>}
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Processing your medical report. Please wait...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="results-container">
        {pdfText && (
          <div className="result-section extracted-text">
            <h2>Extracted Text</h2>
            <div className="text-container">
              <textarea value={pdfText} readOnly className="text-display"></textarea>
            </div>
          </div>
        )}

        {summary && (
          <div className="result-section summary">
            <h2>Medical Report Summary</h2>
            <div className="summary-container">
              <div className="summary-content">
                {summary.includes("Patient:") ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        summary
                          .replace(/\*\*Patient:\*\*/g, '<div class="patient-info"><strong>Patient:</strong>')
                          .replace(/\*\*Conditions:\*\*/g, "</div><h3>Conditions:</h3>")
                          .replace(/\*\*Diagnosis:\*\*/g, '<div class="diagnosis-section"><h3>Diagnosis:</h3>')
                          .replace(
                            /\*\*Treatment Plan:\*\*/g,
                            '</div><div class="treatment-section"><h3>Treatment Plan:</h3>',
                          )
                          .replace(/\*\*Follow-up:\*\*/g, '</div><div class="followup-section"><h3>Follow-up:</h3>')
                          .replace(/\*\*Primary:\*\*/g, "<strong>Primary:</strong>")
                          .replace(/\*\*Secondary:\*\*/g, "<strong>Secondary:</strong>")
                          .replace(/\*\*Medications:\*\*/g, "<strong>Medications:</strong>")
                          .replace(/\*\*Lifestyle Changes:\*\*/g, "<strong>Lifestyle Changes:</strong>")
                          .replace(/\*\*Monitoring:\*\*/g, "<strong>Monitoring:</strong>") + "</div>",
                    }}
                  />
                ) : (
                  summary
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OCR

