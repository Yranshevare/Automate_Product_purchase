import React from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../util/encryptToken";
import axios from "axios";
import { server } from "../../constant";

function StepFive({processData, user}) {

    const [expandedStep, setExpandedStep] = useState(null);
    const [data, setData] = useState(null);


    const navigate = useNavigate();



    const toggleStep = useCallback(async(stepNumber) => {
          if (expandedStep === stepNumber) {
            setExpandedStep(null);
          } else {
            setExpandedStep(stepNumber);
          }
          if(processData.step_five === "Pending" && data === null){
            const res = await axios.get(`${server}po/get/${localStorage.getItem("process")}/`);
            console.log(res.data.data,"step5")
            setData(res.data.data);

          }
    },[expandedStep,data]);



    const handleViewPO = useCallback(async()=>{
      if(processData.step_five === "Incomplete"){
        alert("no purchase order has been generated")
        return
      }
      const token = {
        owner : true,
        id : localStorage.getItem("process"),
        processData,
        user
      }
      const encryptedToken = await encryptData(token);
 
      navigate(`/purchaseOrder/${encryptedToken}`)
    },[]);



    const handleSendPO = useCallback(()=>{
      console.log("send email to ",data.po_email)
    },[data]);



    const handleViewInvoice = useCallback(() => {
      if(data.po_invoice === "none"){
        alert("no invoice has been received")
        return
      }
    },[data]);
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
