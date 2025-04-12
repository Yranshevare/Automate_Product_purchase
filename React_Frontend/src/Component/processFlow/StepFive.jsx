import React from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../util/encryptToken";

function StepFive({processData, user}) {

    const [expandedStep, setExpandedStep] = useState(null);


    const navigate = useNavigate();
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
    const handleViewPO = useCallback(async()=>{
      const token = {
        owner : true,
        id : localStorage.getItem("process"),
        processData,
        user
      }
      const encryptedToken = await encryptData(token);
 
      navigate(`/purchaseOrder/${encryptedToken}`)
    },[]);
    const handleSendPO = useCallback();
    const handleViewInvoice = useCallback();
  return (
    <div className="step-button" onClick={() => toggleStep(5)}>
              <div className="step-content">
                <div className="step-inner-content">
                  <div className="step-header">
                    <div>
                      <span
                        className={
                          processData?.step_five == "Complete"
                            ? "status-complete"
                            : "status-incomplete"
                        }
                      >
                        {processData.step_five || "pending"}
                      </span>
                      <h3>Place a purchase Order</h3>
                    </div>
                  </div>
                  <hr />
                  <p className="step-description">
                    auto generate a purchase order and send it to the selected
                    vendor
                  </p>
                </div>
                <span className={expandedStep === 5 ? "chevron-down" : "chevron-right"}></span>
              </div>
              <div
                className={`expanded-content ${expandedStep === 5 ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="purchase-order-buttons">
                  <button className="po-btn" onClick={handleViewPO}>View this PO</button>
                  <button className="po-btn" onClick={handleSendPO}>send to respective vendor</button>
                  <button className="po-btn" onClick={handleViewInvoice}>view invoice</button>
                </div>
              </div>
            </div>

  );
}

export default StepFive;
