import React, {  useCallback, useEffect, useState } from "react";
import RenderTable from "../Component/reqSheet/RenderTable";

import '../CSS/PurchaseOrder.css';
import { useParams } from "react-router-dom";
import { decryptData } from "../util/encryptToken";
import { ThreeDot } from "react-loading-indicators";
import uploadFile from '../util/handleFileUpload';
import axios from "axios";
import {server} from "../constant";

function InvoiceSubmit() {

  const [formData, setFormData] = useState({
    po_order_number: "",
    po_address: "",
    po_date: '',
    po_name: '',
    po_email: '',
    po_mobile_number:  '',
  });

  
    const [requirementText, setRequirementText] = useState({
      headers:["unit","Description","Unit Price","Total Amount"],
      items:[{"unit":'',"Description":'',"Unit Price":'',"Total Amount":''},
              {"unit":'subtotal 1', "Description":0},
              {"unit":'Discount', "Description":0},
              {"unit":'subtotal 2', "Description":0},
              {"unit":'GST TAX ADD 18%', "Description":0},
              {"unit":'Subtotal 3', "Description":0},
      ]
    });// Initialize tableData, 
  const [terms, setTerms] = useState([{"":""}]);

  const [user, setUser] = useState('');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("Upload Invoice");

    const {token} = useParams() 
    // console.log(token)
  
  // console.log(decryptData(token))

  const loadInfo = useCallback(async () => {
    try {
        const data = await decryptData(token);
        console.log(data)

        const res = await axios.get(`${server}po/get/${data.id}/`,{withCredentials: true});
        console.log(res.data.data)


        const newFormData = {
            ...res.data.data
        }
        delete newFormData.po_tableData
        delete newFormData.po_term_and_condition

        setFormData(newFormData)

        setRequirementText(JSON.parse(data.po_data.po_tableData))

        setUser(data)
        setTerms(JSON.parse(data.po_data.po_term_and_condition))
        setUser(data.user)
        setLoading(true)
    } catch (error) {
        console.log(error.response.data || error)
    }
  }, [])

  useEffect(() => {
    loadInfo();
  }, []);


  const uploadInvoice = useCallback(async (e) => {

    const uploaded_file = event.target.files[0];
    console.log(uploaded_file)
    if(!uploaded_file) {
      alert("Please upload a file")
      return
    }
    if(!confirm(`Are you sure you want to upload this file? ${uploaded_file.name}`)) return
    
    setUploading("Uploading...")
    try {
      const uploadUrl = await uploadFile(uploaded_file);

      const id = (await decryptData(token)).id

      const res = await axios.post(`${server}po/submit_invoice/`,{
        id:id,
        po_invoice:uploadUrl,
        
      },{withCredentials: true})

      console.log(res)
      if(res.data.message === "Invoice submitted successfully" || res.data.message === 'Invoice updated successfully'){
        formData.po_invoice = uploadUrl
        alert(res.data.message)
      }

    } catch (error) {
      console.log(error.response ||error)
    }
    finally{
      setUploading("Upload Invoice")
    }
  },[])






 

  return (
    loading ? 
    <div className="purchase-order-container Po_pdf">
      {/* Header */}
      <div className="header">
        <div className="college-info">
          <h1 className="college-name">TERNA COLLAGE OF ENGINEERING</h1>
          <p className="college-address">Nerul (W), navi mumbai - 400706</p>
        </div>
        <div className="user-info">
          <div className="user-details">
            <h2 className="username">{user?.username ||'username'}</h2>
            <p className="user-email">{user?.email || 'abc@gmail.com'}</p>
          </div>
          <div className="user-avatar">
            <img
              src={
                user?.gender?.toLowerCase() == "male"
                  ? "/boy.png"
                  : "/girl.png"
              }
              alt=""
              className="approve_avatar"
            />
            </div>
        </div>
      </div>

      {/* Form */}
      <form >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="orderNumber" className="form-label">
              PURCHASE ORDER NUMBER:
            </label>
            <input
              type="text"
              id="orderNumber"
              value={formData.po_order_number}
              disabled={true}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="poDate" className="form-label">
              PO Date:
            </label>
            <input
              type="date"
              id="poDate"
              value={formData.po_date}
              disabled={true}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="to" className="form-label">
              TO:
            </label>
            <textarea
              id="to"
              value={formData.po_address}
              disabled={true}
              className="form-textarea"
            />
          </div>
          <div className="form-group-stack">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                NAME:
              </label>
              <input
                type="text"
                id="name"
                value={formData.po_name}
                disabled={true}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL:
              </label>
              <input
                type="email"
                id="email"
                value={formData.po_email}
                disabled={true}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                PHONE:
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.po_mobile_number}
                disabled={true}
                className="form-input"
              />
            </div>
          </div>
        </div>

            <div className="table purchase-order-table">
              {
                RenderTable(requirementText)
              }
            </div>
          
        {/* <div className="div-box"></div> */}
        <div className="terms-conditions-container">
          <div className="terms-conditions-header">
            <label className="form-label">TERMS AND CONDITIONS</label>
            
          </div>
          {
              terms.map((val,idx) => (
                <div className="terms-conditions" key={idx}>
            
                  <input 
                    value={Object.keys(val)[0]}
                    className="section-input"
                    type="text"
                    placeholder="enter the terms and condition" 
                    // onChange={(e) => handleKeyChange(e.target.value, idx)}
                    disabled={true}
                  />
                  <input 
                    value={val[Object.keys(val)[0]]}
                    className="section-input"
                    type="text"
                    placeholder="enter the terms and condition" 
                    // onChange={(e) => handleValueChange(e.target.value,idx)}
                    disabled={true}
                  />
                </div>
              ))
            }
          
        </div>
        


        {/* Footer Signatures */}
        <input type="file"  id="file"  className="invoice-file-input" onChange={uploadInvoice}/>
         <div className="invoice-file">
          {
            formData?.po_invoice !== 'none' ?
              <div className="invoice-present">
              <label htmlFor="file" className="invoice-file-label"><p>{uploading ==="Upload Invoice" ? "Change the invoice" : uploading }</p></label>
              <a href={`${formData?.po_invoice}`} target="_blank">view invoice</a>
              </div>
            
            :
            <label htmlFor="file" className="invoice-file-label"><p>{uploading}</p></label>
          }
            
         </div>
        
      </form>
    </div>
    :
     <ThreeDot color="#d6d6d6" size="small" text="" textColor="" />
  );
}

export default InvoiceSubmit;
