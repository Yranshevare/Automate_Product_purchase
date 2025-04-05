import React, { useCallback, useEffect, useRef, useState } from "react";
import "../CSS/Approval.css";
import FileInput from "../Component/quoteSubmit/FileInput";
import { useParams } from "react-router-dom";
import { decryptData } from "../util/encryptToken";
import axios from "axios";
import { server } from "../constant";
import RenderTable from "../Component/reqSheet/RenderTable";

export default function QuoteSubmit() {
  const [skuValue, setSkuValue] = useState("  ");
  const [department, setDepartment] = useState("  ");
  const [justification, setJustification] = useState("  ")
  const [requirementText, setRequirementText] = useState("");
  const [files, setFiles] = useState([{}]);
  const [tokenData, setTokenData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemType, setItemType] = useState('');

  const {token} = useParams();
  


  const loadInfo = useCallback(async () => {
    const data = await decryptData(token);
    setTokenData(data)


    try {
      setIsLoading(true)
      const [step,existingQuote] = await axios.all([
        axios.get(`${server}stepOne/get/${data.id}/`, { withCredentials: true }),
        axios.get(`${server}rfq/get_all/`, {
          params: { id: data.id },
          withCredentials: true,
        })

      ])
      console.log(step.data)
      console.log(existingQuote.data.sheet)
      setFiles(existingQuote.data.sheet)


      if(step.data.message === "successfully fetched the data"){
        setSkuValue(step?.data?.data?.SKU);
        setDepartment(step?.data?.data?.indenting_department);
        setJustification(step?.data?.data?.justification_for_indenting);
        setRequirementText(JSON.parse(step?.data?.data?.requirementSHeet));


        const a = step?.data?.data?.type_of_item || undefined;
        if (a) {
          //to convert the string to array
          const b = JSON.parse(a.replace(/'/g, '"'));

          let newStr = "";
          b.map((item, idx) => {
            newStr = newStr + item;
            if (idx !== b.length - 1) {
              newStr = newStr + " , ";
            }
          });
          setItemType(newStr)

        } 


      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
     
    
  },[])

  useEffect(()=>{
    loadInfo()
  },[])


  const handleAddFile = useCallback(()=>{
    setFiles(prev => [...prev, {}])
  })
  

  // useEffect(()=>{
  //   console.log(files)
  // },[files])

  
  return (
    !isLoading ?
    <div className="approval-page">
      <div className="content-container">
        <div className="sku-banner">
          <div className="section-info">
            <div className="section-title">STOCK KEEPING UNIT</div>
            <div className="section-id">{skuValue}</div>
          </div>
          <div className="user-info">
            <div className="user-details">
              <div className="username">{tokenData?.user?.username || "abc"}</div>
              <div className="user-email">{tokenData?.user?.email || "abc@efg.com"}</div>
            </div>
            <div className="user-avatar">
              <img
                src={
                  tokenData?.user?.gender?.toLowerCase() == "male"
                    ? "/boy.png"
                    : "/girl.png"
                }
                alt=""
                className="approve_avatar"
              />
              </div>
          </div>
        </div>
        <div className="section-info">
          <div className="section-title">INDENTING DEPARTMENT</div>
          <div className="section-id">{department}</div>
        </div>
        <div className="section-info">
          <div className="section-title">ITEM TYPES</div>
          <div className="section-id">{itemType||"hbuuhoijj"}</div>
        </div>
        <div className="section-info">
          {/* <div className="requirement-sheet"></div> */}
          {
            requirementText && 
            <div className="table">
              {RenderTable(requirementText) }
            </div>
          }
          <div className="section-title">JUSTIFICATION FOR INTENDATION</div>
          <div className="section-id">{justification}</div>
        </div>
        <div className="section-info">
          <div className="section-title">
            SUBMIT THE QUOTATION FILE OF THE PURCHASE:
          </div>
          <div className="add-file-container">
            <button type="button" className="add-file-btn" onClick={handleAddFile}>
              Add another file
            </button>
          </div>
          {
            files.map((file, index) => (
              <FileInput key={index} file={file} />
            ))
          }
        </div>
        
      </div>
    </div>
    :
    <div>loading...</div>
  );
}
