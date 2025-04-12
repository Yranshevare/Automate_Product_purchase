import React, {  useState } from "react";
import RenderTable from "../Component/reqSheet/RenderTable";

import '../CSS/PurchaseOrder.css';


function PurchaseOrderPdfTemplate({user, data,ref}) {

  const [formData, setFormData] = useState({
    po_order_number: data.po_order_number,
    po_address: data.po_address,
    po_date: data.po_date,
    po_name: data.po_name,
    po_email: data.po_email,
    po_mobile_number: data.po_mobile_number,
  });

  const [requirementText, setRequirementText] = useState(JSON.parse(data.po_tableData)); // Initialize tableData, 
  const [terms, setTerms] = useState(JSON.parse(data.po_term_and_condition));


  
  // console.log(decryptData(token))






 

  return (
    <div className="pdf-container" ref={ref}>
    <div className="purchase-order-container Po_pdf">
      {/* Header */}
      <div className="header">
        <div className="college-info">
          <h1 className="college-name">TERNA COLLAGE OF ENGINEERING</h1>
          <p className="college-address">Nerul (W), navi mumbai - 400706</p>
        </div>
        <div className="user-info">
          <div className="user-details">
            <h2 className="username">{user.username ||'username'}</h2>
            <p className="user-email">{user.email || 'abc@gmail.com'}</p>
          </div>
          <div className="user-avatar">
            <img
              src={
                user?.gender.toLowerCase() == "male"
                  ? "/boy.png"
                  : "/girl.png"
              }
              alt=""
              className="approve_avatar"
            />
            </div>
        </div>
      </div>

      {/* Form */}
      <form >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="orderNumber" className="form-label">
              PURCHASE ORDER NUMBER:
            </label>
            <input
              type="text"
              id="orderNumber"
              value={formData.po_order_number}
              disabled={true}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="poDate" className="form-label">
              PO Date:
            </label>
            <input
              type="date"
              id="poDate"
              value={formData.po_date}
              disabled={true}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="to" className="form-label">
              TO:
            </label>
            <textarea
              id="to"
              value={formData.po_address}
              disabled={true}
              className="form-textarea"
            />
          </div>
          <div className="form-group-stack">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                NAME:
              </label>
              <input
                type="text"
                id="name"
                value={formData.po_name}
                disabled={true}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL:
              </label>
              <input
                type="email"
                id="email"
                value={formData.po_email}
                disabled={true}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                PHONE:
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.po_mobile_number}
                disabled={true}
                className="form-input"
              />
            </div>
          </div>
        </div>

            <div className="table purchase-order-table">
              {
                RenderTable(requirementText)
              }
            </div>
          
        {/* <div className="div-box"></div> */}
        <div className="terms-conditions-container">
          <div className="terms-conditions-header">
            <label className="form-label">TERMS AND CONDITIONS</label>
            
          </div>
          {
              terms.map((val,idx) => (
                <div className="terms-conditions" key={idx}>
            
                  <input 
                    value={Object.keys(val)[0]}
                    className="section-input"
                    type="text"
                    placeholder="enter the terms and condition" 
                    onChange={(e) => handleKeyChange(e.target.value, idx)}
                    disabled={true}
                  />
                  <input 
                    value={val[Object.keys(val)[0]]}
                    className="section-input"
                    type="text"
                    placeholder="enter the terms and condition" 
                    onChange={(e) => handleValueChange(e.target.value,idx)}
                    disabled={true}
                  />
                </div>
              ))
            }
          
        </div>
        


        {/* Footer Signatures */}
          <div className="signature-sections">
          <div className="signatures-row">
            <div className="signature-box">
              <div className="signature-line">prespred by - store keeper</div>
            </div>
            <div className="signature-box">
              <div className="signature-line">Recived by</div>
            </div>
          </div>
          <div className="signatures-row">
            <div className="signature-box">
              <div className="signature-line">Recomended by</div>
            </div>
            <div className="signature-box">
              <div className="signature-line">principle</div>
            </div>
          </div>
          </div>
        
      </form>
    </div>
    </div>
  );
}

export default PurchaseOrderPdfTemplate;
