 import React from 'react'
 import { useRef } from 'react'
 import html2canvas from 'html2canvas'
 import JsPDF from 'jspdf'
import axios from 'axios'
import { server } from '../constant'
import Tp from './Tp'
 export default function PDF() {

     const printRef = useRef()


    const generatePdf = async () => {

        


        const element = printRef.current
        console.log(element) 
        if(!element){
            console.log("element not found")
            return
        }   
        const canvas = await html2canvas(element)
        const data = canvas.toDataURL("image/png")

        const pdf = new JsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4"
        });

        const impProps = pdf.getImageProperties(data)


        const pdfWidth = pdf.internal.pageSize.getWidth() 
        const pdfHeight = (impProps.height * pdfWidth / impProps.width) 
        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save("document.pdf")
        // const pdfBlob = pdf.output("blob");
        // console.log(pdfBlob)

        // const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });
        // const fromData = new FormData()
        // fromData.append("pdf", pdfFile);
        // fromData.forEach((value, key) => {
        //     console.log(`${key}:`, value);
        // });


        // try {
        //     const res = await axios.post(`${server}approve/home/`,fromData,{
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         },
        //         withCredentials: true})
        //     console.log(res)
            
        // } catch (error) {
        //     console.log(error.message)
        // }
    }
   return (
     <div  >
        <Tp printRef={printRef}/>
       <button onClick={()=>generatePdf()}>generate</button>
     </div>
   )
 }
 