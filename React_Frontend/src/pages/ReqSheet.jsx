import ChatBox from "../Component/reqSheet/Chatbox";
import { useCallback, useEffect, useState } from "react";
import "../CSS/ReqSheet.css";
import Toast from "../Component/reqSheet/Toast";
import axios from "axios";
import { server } from "../constant";
import { useParams } from "react-router-dom";
import EditableTable from "../Component/reqSheet/EditTable";


const ReqSheet = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [skuValue, setSkuValue] = useState("");
  const [requirementText, setRequirementText] = useState("");
  const [isBannerClosing, setIsBannerClosing] = useState(false);
  const [disable , setDisable] = useState(false)

  const {proId} = useParams()


  const loadInfo = useCallback(async() => {
    try {
      // const res = await axios.get(`${server}stepOne/get/${proId}/`,{withCredentials: true}); 
      // if(res.data.message === "successfully fetched the data" ){
      //   setSkuValue(res?.data?.data?.SKU);
      //   setRequirementText(res?.data?.data?.requirementSHeet);
      // }
      // setDisable(!res?.data?.data?.owner || false)
    } catch (error) {
      console.log(error)
    }
  },[]);

  useEffect(() => { 
    loadInfo();
  },[]);

  const handleBannerClick = useCallback(() => {
    setIsBannerClosing(true);
    setSidebarOpen(true);
  },[isBannerClosing,isSidebarOpen]);


  const handleCloseBanner = useCallback((e) => {
    e.stopPropagation();
    setIsBannerClosing(true);
  },[isBannerClosing]);

  
 
  
  const handleSubmit = useCallback(async(e) => {
    e.preventDefault();
    if(requirementText === "" || skuValue === ""){
      alert("please fill all the places")
      return
    }
    try {
      const res = await axios.post(`${server}stepOne/save/`,{requirementSHeet:requirementText,SKU:skuValue},{withCredentials: true});
      alert(res.data.message)
      console.log(res)
    } catch (error) {
      console.log(error)
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
              disabled = {disable}
              className="sku-input"
              placeholder="mention your SKU"
              value={skuValue}
              onChange={(e) => setSkuValue(e.target.value)}
            />
            <h2 className="section-title">REQUIREMENT SHEET</h2>
              <EditableTable tableData={requirementText}/>
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
        setRequirementText={setRequirementText}
      />
    </div>
  );
};

export default ReqSheet;
