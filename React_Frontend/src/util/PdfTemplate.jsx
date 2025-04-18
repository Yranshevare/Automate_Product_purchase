import React from "react";
import "../CSS/ReqSheet.css";
import RenderTable from "../Component/reqSheet/RenderTable";

function PdfTemplate({printRef,reqSheet, approve_email}) {
  let currentDate = new Date(); // Outputs the full date and time
  // let dateOnly = currentDate.toDateString();  // Example: "Wed Mar 26 2025"
  let formattedDate = currentDate.toISOString().split('T')[0];  // Example: "2025-03-26"
  // console.log(reqSheet,"com")



  return (
    <div 
    
    className="req-sheet-container print">
      <div 
      className="pdf-container"
      ref={printRef}>
      <div className={`main-content-reqSheet`}>
        <div className="pdf-header">
          <div className="section-title collage-name">TERNA ENGINEERING COLLAGE</div>
          <div className="date-section">
            <p>Date : </p>
            <div >{formattedDate}</div>
          </div>
        </div>
        {/* Form */}

        <form>
          <div className={`form-section`}>
            <h2 className="section-title">STOCK KEEPING UNIT</h2>
            <p className="section-input"> {reqSheet?.SKU}</p>
            <h2 className="section-title">INDENTING DEPARTMENT</h2>
            <p className="section-input"> {reqSheet?.indenting_department}</p>
            <h2 className="section-title">TYPE OF ITEMS</h2>
            <p className="section-input"> {reqSheet?.type_of_item}</p>

            <h2 className="section-title">REQUIREMENT SHEET</h2>

            <div className="table-container">
              {/* <EditableTable tableData={requirementText} setFinalData={setFinalData} /> */}
              <div className="table">
              {
                reqSheet?.requirementSHeet && RenderTable(JSON.parse(reqSheet?.requirementSHeet))
              }
              </div>
            </div>

            <h2 className="section-title">JUSTIFICATION FOR INDENTING</h2>
            <p >{reqSheet?.justification_for_indenting}</p>
          </div>
        </form>
        <div className="signature-section">
        {
          approve_email && 
            <>
              {
                approve_email.map((email,idx) => <div key={idx} className="signature-authority">
                <div className="signature" ></div>
                <label>{email.name}</label>
                <label >{email.accepted_by_email}</label>
              </div>)
              }
            </>
        }
        </div>
       
      </div>
      </div>
    </div>
  );
}

export default PdfTemplate;
