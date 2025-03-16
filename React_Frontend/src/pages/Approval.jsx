import React, { use, useCallback, useEffect, useState } from "react";
import "../CSS/Approval.css";
import { useParams } from "react-router-dom";
import { decryptData } from "../util/encryptToken";

function Approval() {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const {data} = useParams()
  console.log(data)

  const load = useCallback(async() => {
    const dec = await decryptData(data)
    console.log(dec)
  })
  useEffect(() => {
    load()
  },[])


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
          <div className="sku-info">
            <div className="sku-title">STOCK KEEPING UNIT</div>
            <div className="sku-id">lnskhdk/djskhdks-khksd</div>
          </div>
          <div className="user-info">
            <div className="user-details">
              <div className="username">username</div>
              <div className="user-email">abc@gmail.com</div>
            </div>
            <div className="user-avatar"></div>
          </div>
        </div>

        <div className="data-sheet"></div>

        {/* Approval Buttons */}
        <div className={`approval-buttons ${showRejectForm ? "shifted" : ""}`}>
          <button className="approve-btn" onClick={handleApprove}>
            Approve
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Reject
          </button>
        </div>

        {/* Rejection Form */}
        <div className={`rejection-form-container ${showRejectForm ? "shifted" : ""}`}>
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

