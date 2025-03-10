import ChatBox from "../Component/reqSheet/Chatbox";
import { useCallback, useEffect, useState } from "react";
import "../CSS/ReqSheet.css";
import Toast from "../Component/reqSheet/Toast";
import axios from "axios";
import { server } from "../constant";
import { useParams } from "react-router-dom";
import EditableTable from "../Component/reqSheet/EditTable";
import { useNavigate } from "react-router-dom";


const ReqSheet = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [skuValue, setSkuValue] = useState("");
  const [requirementText, setRequirementText] = useState("");
  const [isBannerClosing, setIsBannerClosing] = useState(false);
  const [disable , setDisable] = useState(false)
  const [finalData,setFinalData] = useState()

  const {proId} = useParams()

  const navigate = useNavigate()

  


  const loadInfo = useCallback(async() => {
    try {
      const res = await axios.get(`${server}stepOne/get/${proId}/`,{withCredentials: true}); 
      if(res.data.message === "successfully fetched the data" ){
        setSkuValue(res?.data?.data?.SKU);
        setRequirementText(JSON.parse(res?.data?.data.requirementSHeet));
      }
      console.log(res.data.data)
      setDisable(res?.data?.data?.owner || false)
    } catch (error) {
      console.log(error.response.data || error.response.data)
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
    if( skuValue === ""){
      alert("please fill all the places")
      return
    }
    try {
      const res = await axios.post(`${server}stepOne/save/`,{requirementSHeet:JSON.stringify(finalData),SKU:skuValue},{withCredentials: true});
      alert(res.data.message)
    } catch (error) {
      console.log(error.response.data.message || error.response.data.error)
    }
  },[requirementText,skuValue,finalData]);


  const deleteStepOne = useCallback(async() => {
    alert("are you sure! do you really want to delete this step")
    try {
      const res = await axios.delete(`${server}stepOne/delete/`,{withCredentials: true});
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  },[])
  
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
              <EditableTable tableData={requirementText} setFinalData={setFinalData} />
          </div>
          
        </form>
        {
          disable && 
            <div 
            type = "button"
            onClick={deleteStepOne}
            className="table-submit-but">
              <button className={`delete ${isBannerClosing ? "closing" : ""} `}>delete</button>
            </div>
        }
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
