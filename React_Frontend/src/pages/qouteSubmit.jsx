import React, { useCallback, useEffect, useRef, useState } from "react";
import "../CSS/Approval.css";

export default function QuoteSubmit() {
  const [skuValue, setSkuValue] = useState("  ");
  const [department, setDepartment] = useState("  ");
  const [justification, setJustification] = useState("  ")
  const [requirementText, setRequirementText] = useState("");


  const handleAddFile = useCallback(()=>{

  })
  const handleViewQuote = useCallback(()=>{

  })
  const handleUploadQuote = useCallback(()=>{

  })
  return (
    <div className="approval-page">
      <div className="content-container">
        <div className="sku-banner">
          <div className="section-info">
            <div className="section-title">STOCK KEEPING UNIT</div>
            <div className="section-id">oihouh2eioi</div>
          </div>
          <div className="user-info">
            <div className="user-details">
              <div className="username">abcd</div>
              <div className="user-email">abc@gmail.com</div>
            </div>
            <div className="user-avatar">
                <img className="approve_avatar" />
              </div>
          </div>
        </div>
        <div className="section-info">
          <div className="section-title">INDENTING DEPARTMENT</div>
          <div className="section-id">augiugbub</div>
        </div>
        <div className="section-info">
          <div className="section-title">ITEM TYPES</div>
          <div className="section-id">hbuuhoijj</div>
        </div>
        <div className="section-info">
          <div className="requirement-sheet"></div>
          <div className="section-title">JUSTIFICATION FOR INTENDATION</div>
          <div className="section-id">joohhiwejmfoejow</div>
        </div>
        <div className="section-info">
          <div className="section-title">
            SUBMIT THE QUOTATION FILE OF THE PURCHASE:
          </div>
          <div className="add-file-container">
            <button type="button" className="add-file-btn" onClick={handleAddFile}>
              Add another file
            </button>
          </div>
          <div className="upload-file-container">
          <button type="button" className="upload-btn" onClick={handleUploadQuote}>
                <span>Upload The Quotation File</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </button>
              <button type="button" className="view-btn" onClick={handleViewQuote}>
              view
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
