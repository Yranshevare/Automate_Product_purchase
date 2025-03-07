"use client";

import { useState } from "react";
import "../CSS/ReqSheet.css";

const ReqSheet = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [skuValue, setSkuValue] = useState("");
  const [requirementText, setRequirementText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [showInfoBanner, setShowInfoBanner] = useState(true); // New state to control info banner visibility

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSidebarOpen(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setUserInput("");
  };

  const handleCloseBanner = () => {
    setShowInfoBanner(false); // Hide the info banner
  };
  return (
    <div className="req-sheet-container">
      <div className={`main-content-reqSheet ${isSidebarOpen ? "with-sidebar" : ""}`}>
        {/* Info Banner */}
        {showInfoBanner && (
          <div className="info-banner">
            <div className="info-icon-container">
              <img src="/info-icon.svg" alt="Info Icon" className="info-icon" />
            </div>
            <div className="info-text">
              <p className="info-title">do you know that ?</p>
              <p className="info-description">
                you can generate the requirement sheet via AI so simple and easy
              </p>
            </div>
            <button className="close-button" onClick={handleCloseBanner}>
              X
            </button>
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">STOCK KEEPING UNIT</h2>
            <input
              type="text"
              className="sku-input"
              placeholder="mention your SKU"
              value={skuValue}
              onChange={(e) => setSkuValue(e.target.value)}
            />
            <h2 className="section-title">REQUIREMENT SHEET</h2>
            <textarea
              className="requirement-textarea"
              placeholder="define your requirement sheet here"
              value={requirementText}
              onChange={(e) => setRequirementText(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="submit-button">
            submit
          </button>
        </form>
      </div>
      {/* Sidebar Toggle Button */}
      {isSidebarOpen ? (
        <div className={`sidebar-toggle open`} onClick={toggleSidebar}>
          &gt;
        </div>
      ) : (
        <div className={`sidebar-toggle`} onClick={toggleSidebar}>
          &lt;
        </div>
      )}
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="chat-initial">
            <h3 className="chat-title">Hey there,</h3>
            <h3 className="chat-title">what is your use case?</h3>
            <p className="chat-description">
              Just tell me about your use case and I will suggest you a nice
              requirement
            </p>
          </div>
        </div>
        <form className="chat-input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="specify your use case here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit" className="arrow-up-button">
            <img
              src="/arrow-up-icon.svg"
              alt="Arrow Up Icon"
              className="arrow-up-icon"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReqSheet;
