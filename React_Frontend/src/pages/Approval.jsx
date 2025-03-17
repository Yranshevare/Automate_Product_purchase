import React, { use, useCallback, useEffect, useState } from "react";
import "../CSS/Approval.css";
import { useParams } from "react-router-dom";
import { decryptData } from "../util/encryptToken";
import { server } from "../constant";
import axios from "axios";
import { Suspense } from "react";
import RenderTable from "../Component/reqSheet/RenderTable";
import { ThreeDot } from "react-loading-indicators";

function Approval() {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [reqSheet, setReqSheet] = useState({})
  const [info,setInfo] = useState({})
  const [loading, setLoading] = useState(false);

  const {data} = useParams()
  // console.log(data)

  useEffect(() => {
    console.log(reqSheet)
  },[reqSheet])

  useEffect(() => {
    console.log(info)
    if(info.owner){
      setShowRejectForm(true)
    }
  },[info])
  let dec = undefined
  const load = useCallback(async() => {
    try{
      let dec = await decryptData(data)
      setInfo(dec)
      const step = await axios.get(`${server}stepOne/get/${dec.id}/`,{withCredentials: true}); 
      if(step.data?.message === "successfully fetched the data"){
        setReqSheet(step?.data?.data)
      }
      setLoading(true)
      console.log(step)
    }
    catch (error) {
      console.log(error.response)
    }
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
    loading ? 
    <div className="approval-page">
      <div className={`content-container ${showRejectForm ? "shifted" : ""}`}>
        <div className="sku-banner">
          <div className="sku-info">
            <div className="sku-title">STOCK KEEPING UNIT</div>
              <div className="sku-id">{reqSheet?.SKU}</div>
          </div>
          <div className="user-info">
           {<> 
            <Suspense fallback={<div>Loading...</div>}>
            <div className="user-details">
              <div className="username">{info?.user?.username}</div>
              <div className="user-email">{info?.user?.email}</div>
            </div>
            <div className="user-avatar">
              <img src={info.user?.gender.toLowerCase() == 'male'  ? '/boy.png' : '/girl.png'} alt="" className="approve_avatar" />
            </div>
            </Suspense>
            </>
          }
          </div>
        </div>
          {
            reqSheet?.requirementSHeet ? (
              <div className='table'>
                {RenderTable(JSON.parse(reqSheet?.requirementSHeet))}
              </div>
            ) 
            :
            <div className="data-sheet"></div>
          }

        {/* Approval Buttons */}
        {
          !info.owner && 
        <div className={`approval-buttons ${showRejectForm ? "shifted" : ""}`}>
          <button className="approve-btn" onClick={handleApprove}>
            Approve
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Reject
          </button>
        </div>
        }

        {/* Rejection Form */}
        <div className={`rejection-form-container ${showRejectForm ? "shifted" : ""}`}>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Please provide your response here..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            ></textarea>
            {
              !info.owner && 
              <button type="submit" className="submit-btn">
              Submit
            </button>
            }
          </form>
        </div>
      </div>
    </div>
    :
    <ThreeDot color="#d6d6d6" size="small" text="" textColor="" />
  );
}

export default Approval;

