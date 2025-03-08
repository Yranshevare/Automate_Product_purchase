import ChatBox from "../Component/reqSheet/Chatbox";
import { useCallback, useState } from "react";
import "../CSS/ReqSheet.css";
import Toast from "../Component/reqSheet/Toast";


const ReqSheet = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [skuValue, setSkuValue] = useState("");
  const [requirementText, setRequirementText] = useState("");
  const [isBannerClosing, setIsBannerClosing] = useState(false);
  // const [showInfoBanner, setShowInfoBanner] = useState(true);

  const handleBannerClick = useCallback(() => {
    setIsBannerClosing(true);
    setSidebarOpen(true);
  },[isBannerClosing,isSidebarOpen]);


  const handleCloseBanner = useCallback((e) => {
    e.stopPropagation();
    setIsBannerClosing(true);
  },[isBannerClosing]);

  
  const handleInsert = useCallback(() => {
    const sampleText =
    "Crafted passionately by our team, where boundless imagination fuels groundbreaking innovation, this project is not just a design, but a revolution in the making!"
    setRequirementText((prev) => (prev ? `${prev}\n\n${sampleText}` : sampleText))
    setSidebarOpen(!isSidebarOpen);
  },[requirementText,isSidebarOpen]);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if(requirementText === "" || skuValue === ""){
      alert("please fill all the places")
      return
    }
    console.log(requirementText)
    console.log(skuValue)
  },[requirementText,skuValue]);
  
  return (
    <div className="req-sheet-container">
      <div className={`main-content-reqSheet ${isSidebarOpen ? "with-sidebar" : ""}`}>
        {/* Info Banner */}
            <Toast 
              handleBannerClick={handleBannerClick} 
              isBannerClosing={isBannerClosing} 
              handleCloseBanner={handleCloseBanner}
            />
        
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
      <ChatBox 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        handleInsert={handleInsert}
      />
    </div>
  );
};

export default ReqSheet;
