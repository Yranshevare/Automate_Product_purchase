import React, {  useCallback, useEffect, useState } from "react";
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
  const [responding, setResponding] = useState("");

  const {data} = useParams()
  // console.log(data)

 

  useEffect(() => {
    console.log(info)
    if(info.owner){
      setShowRejectForm(true)
    }
  },[info])
  const load = useCallback(async() => {
    try{
      let dec = await decryptData(data)
      setInfo(dec)
      const [step,approve] = await axios.all([
        axios.get(`${server}stepOne/get/${dec.id}/`,{withCredentials: true}),
        axios.get(`${server}approve/get_one/`,{
          params: { process_id: dec.id , email:dec.email },
          withCredentials: true
        })
      ])
      if(step.data?.message === "successfully fetched the data"){
        setReqSheet(step?.data?.data)
      }
      setLoading(true)
      setRejectReason(approve?.data?.data?.response)
      console.log(step,approve)
    }
    catch (error) {
      console.log(error.response)
    }
  })
  useEffect(() => {
    load()
  },[])


  const handleApprove = useCallback(async() => {
    // setShowRejectForm(false);
    try {
      setResponding("Approving")
      const res = await axios.get(`${server}approve/approve_request/`,{
        params: { process_id: info.id , email:info.email },
        withCredentials: true
      })
      if(res.data.message === "your request has been approve"){
        alert(res.data.message)
      }
      console.log(res)
    } catch (error) {
      console.log(error.response)
    }finally{
      setResponding("")
    }

  },[info]);

  const handleSubmit = useCallback(async(e) => {
    e.preventDefault();
    if(rejectReason.trim()===""){
      alert("Please enter a reason for rejection")
      return
    }
    try {
      const res = await axios .get(`${server}approve/reject_request/`,{
        params: { process_id: info.id , email:info.email , reason:rejectReason },
        withCredentials: true
      })
      console.log(res)
      alert(res.data.message)
    } catch (error) {
      alert(error.response.data.message)
      console.log(error.response)
    }
    
    console.log(info,rejectReason)
  },[info,rejectReason]);

  return (
    loading ? 
    <div className="approval-page">
      <div className={`content-container ${showRejectForm ? "shifted" : ""}`}>
        <div className="sku-banner">
          <div className="section-info">
            <div className="section-title">STOCK KEEPING UNIT</div>
            <div className="section-id">lnskhdk/djskhdks-khksd</div>
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
          {
            reqSheet?.requirementSHeet ? (
              <div className='table'>
                {RenderTable(JSON.parse(reqSheet?.requirementSHeet))}
              </div>
            ) 
            :
            <div className="data-sheet"></div>
          }

        {/* Rejection Form */}
        <div className={`rejection-form-container`}>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Please provide your response here..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              // required
            ></textarea>
            {
              !info.owner && 
              <div className="approval-buttons">
                <button type="button" onClick={()=>setShowRejectForm(false)} className="approve-btn">Cancel</button>
                <button type="submit" className="reject-btn">
                {responding === "Rejecting" ? "Rejecting..." : "submit"}
                </button>
              </div>
            }
          </form>
        </div>
      </div>
      </div>
    </div>
    :
    <ThreeDot color="#d6d6d6" size="small" text="" textColor="" />
  );
}

export default Approval;

