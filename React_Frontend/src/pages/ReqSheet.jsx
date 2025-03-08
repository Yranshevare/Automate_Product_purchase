"use client";

import { useState } from "react";
import "../CSS/ReqSheet.css";

const ReqSheet = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [skuValue, setSkuValue] = useState("");
  const [requirementText, setRequirementText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatbot, setChatbot] = useState(false)
  const [isBannerClosing, setIsBannerClosing] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

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
    setChatbot(true);
  };

  const handleInsert = () => {
    // Simple insert function that adds sample text to the requirement
    const sampleText =
      "Crafted passionately by our team, where boundless imagination fuels groundbreaking innovation, this project is not just a design, but a revolution in the making!"
    setRequirementText((prev) => (prev ? `${prev}\n\n${sampleText}` : sampleText))
  }

  const handleBannerClick = () => {
    setIsBannerClosing(true);
    setSidebarOpen(true);
    setTimeout(() => {
      setShowInfoBanner(false);
    }, 300);
  };

  const handleCloseBanner = (e) => {
    e.stopPropagation();
    setIsBannerClosing(true);
    setTimeout(() => {
      setShowInfoBanner(false);
    }, 300);
  };

  return (
    <div className="req-sheet-container">
      <div className={`main-content-reqSheet ${isSidebarOpen ? "with-sidebar" : ""}`}>
        {/* Info Banner */}
        {showInfoBanner && (
          <div className={`info-banner ${isBannerClosing ? "closing" : ""}`} onClick={handleBannerClick}>
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
          <div className={`form-section ${isBannerClosing ? "closing" : ""}`}>
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
          <button type="submit" className={`submit-button ${isBannerClosing ? "closing" : ""}`}>
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
        {!chatbot ? (
            <div className="chat-initial">
              <h3 className="chat-title">Hey there,</h3>
              <h3 className="chat-title">what is your use case?</h3>
              <p className="chat-description">
                Just tell me about your use case and I will suggest you a nice requirement
              </p>
            </div>
          ) : (
            <div className="chatbot">
              <p className="chat-paragraph">
                Crafted passionately by our team, where boundless imagination fuels groundbreaking innovation, this
                project is not just a design, but a revolution in the making! SayHello redefines the future of digital
                interaction with seamless, intelligent conversations that elevate user experience to new heights. With
                cutting-edge AI capabilities, SayHello ensures every interaction is insightful, responsive, and
                engaging.
              </p>
              <button className="insert-button" onClick={handleInsert}>
                insert
              </button>
            </div>
            
          )}
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
