import React, { useCallback, useState } from 'react'

import uploadFile from '../../util/handleFileUpload';

export default function FileInput({file}) {

  const [files, setFiles] = useState({});
  const [docLink, setDocLink] = useState("");
  const [uploading, setUploading] = useState("Upload The Quotation File");



    const handleUploadQuote = async(event)=>{
      const uploaded_file = event.target.files[0];
      if (!uploaded_file) {
        return
      }
      if(!confirm(`Are you sure you want to upload this file? ${uploaded_file.name}`)) return

      setUploading("Uploading...")



      try {
        const res = await uploadFile(uploaded_file);
        console.log(res)



        setFiles({uploaded_file});
        setDocLink(res);
      } catch (error) {
        console.log(error)
      }finally{
        setUploading("Upload The Quotation File")
      }
    }



    const handleRemoveQuote = useCallback(()=>{

      if (!confirm("are you sure that you want to remove this quote from?"))return

      
      setFiles({})
    })
    

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
        <a type="button" className="view-btn" target="_blank" href={`${docLink}` || "#"}>
          view
        </a>
        <button type="button" className="view-btn" onClick={handleRemoveQuote}>
          remove
        </button>
        </>

      }
           
    </div>
  )
}
