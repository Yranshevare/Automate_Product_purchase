import React, { useState } from "react";
import "../CSS/Approval.css";

function Approval() {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = () => {
    setShowRejectForm(true);
  };

  const handleApprove = () => {
    setShowRejectForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowRejectForm(false);
    setRejectReason("");
  };

  return (
    <div className="approval-page">
      <div className={`content-container ${showRejectForm ? "shifted" : ""}`}>
        <div className="sku-banner">
          <div className="section-info">
            <div className="section-title">STOCK KEEPING UNIT</div>
            <div className="section-id">lnskhdk/djskhdks-khksd</div>
          </div>
          <div className="user-info">
            <div className="user-details">
              <div className="username">username</div>
              <div className="user-email">abc@gmail.com</div>
            </div>
            <div className="user-avatar"></div>
          </div>
        </div>
        <div className="section-info">
            <div className="section-title">INDENTING DEPARTMENT</div>
            <div className="section-id">information technology</div>
        </div>
        <div className="section-info">
            <div className="section-title">ITEM TYPES</div>
            <div className="section-id">lnskhdk/djskhdks-khksd</div>
        </div>

        <div className="data-sheet"></div>

        <div className="section-info">
            <div className="section-title">JUSTIFICATION FOR INTENDATION</div>
            <div className="section-id">lnskhdk/djskhdks-khksd</div>
        </div>

        {/* Rejection Form */}
        <div className={`rejection-form-container`}>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Please provide your response here..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Approval;

