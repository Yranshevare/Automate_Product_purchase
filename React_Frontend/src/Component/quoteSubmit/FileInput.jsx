import React, { useCallback, useDebugValue, useEffect, useState } from 'react'

import uploadFile from '../../util/handleFileUpload';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { decryptData } from '../../util/encryptToken';
import { server } from '../../constant';
import deleteFile from '../../util/deleteUploadedFile';

export default function FileInput({file,reloadInfo}) {

  const [files, setFiles] = useState(file || {});
  const [docLink, setDocLink] = useState("");
  const [uploading, setUploading] = useState("Upload The Quotation File");
  const [tokenData, setTokenData] = useState(null);
  const [removeLoader,setRemoveLoader] = useState("remove")

  const {token} = useParams()
  // console.log(token)
  // console.log(files)


  const loadInfo = useCallback(async () => {
    const data = await decryptData(token);
    // console.log(data)
    setTokenData(data)
  }, []);

  useEffect(() => {
    loadInfo();
  }, []);

  useEffect(() => {
    setFiles(file);
  }, [file]);



    const handleUploadQuote = async(event)=>{
      const uploaded_file = event.target.files[0];
      if (!uploaded_file) {
        return
      }
      if(!confirm(`Are you sure you want to upload this file? ${uploaded_file.name}`)) return

      setUploading("Uploading...")



      try {
        // console.log("lll")
        const uploadUrl = await uploadFile(uploaded_file);
        // console.log(uploadUrl)

        const res = await axios.post(`${server}rfq/submit/`,{
          sheet : uploadUrl,
          id: tokenData.id
        },{withCredentials: true})
        console.log(res)
        if (res.data.message == "data submitted successfully"){
          alert("data submitted successfully")
          setFiles({sheet:uploadUrl});
          reloadInfo()
        }



        setDocLink(res);
      } catch (error) {
        console.log(error)
      }finally{
        setUploading("Upload The Quotation File")
      }
    }



    const handleRemoveQuote = useCallback(async ()=>{

      if (!confirm("are you sure that you want to remove this quote from?"))return
      setRemoveLoader("removing....")
      console.log(files,"files")
      try {
        const del =  deleteFile(files.sheet)
        const res = await axios.post(`${server}rfq/remove/`,{
          file_id:del,
          id: files.id 
        },{
          withCredentials: true
        })
        console.log(res)

        if(res.data.message === "data deleted successfully"  ){

          // function to delete the image from cloudinary
          alert("data deleted successfully")
          // reloadInfo()
          setFiles({})
        }
        console.log(del)
      } catch (error) {
        console.log(error.response?.data || error)
      }finally{
        setRemoveLoader("remove")
      }
      // setFiles({})
    },[files])
    

  return (
    <div className="upload-file-container">


      {
        !Object.keys(files).length > 0 ?
        <>
          <input 
            type="file" 
            id="file_input"
            onChange={handleUploadQuote} 
          />
          <label htmlFor="file_input" className="upload-btn">
              <div className="upload-bul-container" >
                <span>{uploading}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
          </label>
        </> 
        :
        <>
        <a type="button" className="view-btn" target="_blank" href={`${files.sheet}` || "#"}>
          view
        </a>
        <button type="button" className="view-btn" onClick={handleRemoveQuote}>
          {removeLoader}
        </button>
        </>

      }
           
    </div>
  )
}
