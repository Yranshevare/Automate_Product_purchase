import React, { useState } from "react";
import '../CSS/PurchaseOrder.css';

function PurchaseOrder() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    to: "",
    poDate: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="purchase-order-container">
      {/* Header */}
      <div className="header">
        <div className="college-info">
          <h1 className="college-name">TERNA COLLAGE OF ENGINEERING</h1>
          <p className="college-address">Nerul (W), navi mumbai - 400706</p>
        </div>
        <div className="user-info">
          <div className="user-details">
            <h2 className="username">username</h2>
            <p className="user-email">abc@gmail.com</p>
          </div>
          <div className="avatar"></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="orderNumber" className="form-label">
              PURCHASE ORDER NUMBER:
            </label>
            <input
              type="text"
              id="orderNumber"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="poDate" className="form-label">
              PO Date:
            </label>
            <input
              type="text"
              id="poDate"
              name="poDate"
              value={formData.poDate}
              onChange={handleChange}
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
              name="to"
              value={formData.to}
              onChange={handleChange}
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
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="div-box"></div>

        <div className="div-box"></div>


        <div className="submit-container">
          <button type="submit" className="submit-button">
            submit
          </button>
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
  );
}

export default PurchaseOrder;
