import html2canvas from "html2canvas";
import JsPDF from "jspdf";

const generatePdf = async(printRef)=>{
  
    const element = printRef.current
    console.log(element) 
      if(!element){
          console.log("element not found")
          return
      }   
      const canvas = await html2canvas(element,{
        scale:1,
        useCORS: true,
        logging:false
      })
      const data = canvas.toDataURL("image/png",0.5)

      const pdf = new JsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
          compress: true
      });

      const impProps = pdf.getImageProperties(data)


      const pdfWidth = pdf.internal.pageSize.getWidth() 
      const pdfHeight = (impProps.height * pdfWidth / impProps.width) 
      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight)
      const pdfBlob = pdf.output("blob");
    //   pdf.save("document.pdf")
      const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });
      const fromData = new FormData()
      fromData.append("pdf", pdfFile);
      // pdf.save("document.pdf")
      


      return fromData
  }

  export default generatePdf