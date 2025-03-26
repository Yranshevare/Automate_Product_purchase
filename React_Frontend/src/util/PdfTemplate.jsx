import React from "react";
import "../CSS/ReqSheet.css";
import { useState } from "react";
import Checkbox from "/src/Component/reqSheet/Checkbox";

function PdfTemplate() {
  const [skuValue, setSkuValue] = useState("  ");
  const [department, setDepartment] = useState("  ");
  const [justification, setJustification] = useState("  ");
  const [selectedValues, setSelectedValues] = useState([]);

  const handleCheckboxChange = (event) => {
    console.log(selectedValues);
    const { value, checked } = event.target;
    setSelectedValues((prevValues) =>
      checked ? [...prevValues, value] : prevValues.filter((v) => v !== value)
    );
  };

  return (
    <div className="req-sheet-container">
      <div className={`main-content-reqSheet`}>
        <div className="date-section">
          <span>Date : </span>
          <div className="date"></div>
        </div>
        {/* Form */}

        <form>
          <div className={`form-section`}>
            <h2 className="section-title">STOCK KEEPING UNIT</h2>
            <p className="section-input"> {skuValue}</p>
            <h2 className="section-title">INDENTING DEPARTMENT</h2>
            <p className="section-input"> {department}</p>
            <h2 className="section-title">TYPE OF ITEMS</h2>
            <div className="checkbox-options">
              {/* <div className="checkbox-column">
                <Checkbox
                  label="Consumable"
                  value="consumable"
                  checked={selectedValues.includes("consumable")}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  label="Stationary"
                  value="stationary"
                  checked={selectedValues.includes("stationary")}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  label="Furniture"
                  value="furniture"
                  checked={selectedValues.includes("furniture")}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  label="Spares"
                  value="spares"
                  checked={selectedValues.includes("spares")}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  label="Capital Equipment"
                  value="capital_equipment"
                  checked={selectedValues.includes("capital_equipment")}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  label="Other"
                  value="other"
                  checked={selectedValues.includes("other")}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  label="Printing"
                  value="printing"
                  checked={selectedValues.includes("printing")}
                  onChange={handleCheckboxChange}
                />
                <Checkbox
                  label="Capital Other"
                  value="capital_other"
                  checked={selectedValues.includes("capital_other")}
                  onChange={handleCheckboxChange}
                />
              </div> */}
              <div className="checkbox-column">
                {selectedValues.join(" , ") || "None selected"}
              </div>
            </div>

            <h2 className="section-title">REQUIREMENT SHEET</h2>

            <div className="table-container">
              {/* <EditableTable tableData={requirementText} setFinalData={setFinalData} /> */}
            </div>

            <h2 className="section-title">JUSTIFICATION FOR INDENTING</h2>
            <p className="justification-textarea">{justification}</p>
          </div>
        </form>
        <div className="signature-section">
          <div className="signature-authority">
            <div className="signature"></div>
            <label>member</label>
          </div>
          <div className="signature-authority">
            <div className="signature"></div>
            <label>member</label>
          </div>
          <div className="signature-authority">
            <div className="signature"></div>
            <label>member</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfTemplate;
