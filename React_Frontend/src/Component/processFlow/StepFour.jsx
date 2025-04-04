import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

function StepFour() {
    const [expandedStep, setExpandedStep] = useState(null);
    const toggleStep = useCallback(
        (stepNumber) => {
          if (expandedStep === stepNumber) {
            setExpandedStep(null);
          } else {
            setExpandedStep(stepNumber);
          }
        },
        [expandedStep]
      );
      const handleViewQuote = useCallback(()=>{

      })
      const handleSelectQuote = useCallback(()=>{
        
      })
  return (
    <>
      <div className="step-button" onClick={() => toggleStep(4)}>
      <div className="step-content">
                    <div className='step-inner-content'>
                        <div className="step-header">
                            <div>
                                <span className={"status-incomplete"}></span>
                                <h3>Quote selection</h3>
                            </div>
                        </div>
                        <hr />
                        <p className="step-description">select the specific quote for approval</p>
                    </div>
                    <span className={expandedStep === 4 ? "chevron-down" : "chevron-right"}>
                    </span>
                </div>
                <div className={`expanded-content ${expandedStep === 4 ? "open" : ""}`}
                onClick={(e)=>e.stopPropagation()}>
                    <div className="quotation-buttons">
                      <button className="view-quote-button" onClick={handleViewQuote}>View Quotation</button>
                      <button className="select-quote-button" onClick={handleSelectQuote}>Select this Quote</button>
                    </div>
                </div>
      </div>
    </>
  );
}

export default StepFour;
