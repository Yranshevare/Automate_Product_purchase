import React, { useCallback, useEffect, useRef, useState } from "react";
import "../CSS/Approval.css";
import FileInput from "../Component/quoteSubmit/FileInput";

export default function QuoteSubmit() {
  const [skuValue, setSkuValue] = useState("  ");
  const [department, setDepartment] = useState("  ");
  const [justification, setJustification] = useState("  ")
  const [requirementText, setRequirementText] = useState("");
  const [files, setFiles] = useState([{}]);

  const handleAddFile = useCallback(()=>{
    setFiles(prev => [...prev, {"idx":`${files.length}`}])
  })
  

  useEffect(()=>{
    console.log(files)
  },[files])

  
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
          {
            files.map((file, index) => (
              <FileInput key={index} file={file} />
            ))
          }
        </div>
        
      </div>
    </div>
  );
}
