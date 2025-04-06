import React from "react";
import {server} from "../../constant";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

function StepThree({processData}) {
    const [expandedStep, setExpandedStep] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState([]);



    const loadInfo = useCallback(async () => {
      if(processData.step_two != "Complete") return
      try {
        const res = await axios.get(`${server}rfq/get_all/`, {
          params: { id: localStorage.getItem("process") },
          withCredentials: true,
        });
        console.log(res?.data.sheet)
        if(res.status === 200){
          setQuotes(res?.data?.sheet)
          
        } 
      } catch (error) {
        console.log(error)
      }
    },[])

    useEffect(() => {
      loadInfo()
    },[])

    useEffect(() => {
      quotes.map((quote,idx) => {
        setSelectedQuote(prev => [...prev,quote.type])
      })
      console.log("Lll")
    },[quotes])
    const toggleStep = useCallback((stepNumber) => {
      // console.log(quotes)
      if(quotes.length === 0) {
        alert("No quotes found")
        return
      }
      if(processData.step_two != "Complete") {
        alert("Please complete previous steps first")
        return
      }
          if (expandedStep === stepNumber) {
            setExpandedStep(null);
          } else {
            setExpandedStep(stepNumber);
          }
        },[expandedStep,quotes]);
      
      const handleSelectQuote = useCallback(async(idx)=>{
        console.log(quotes[idx])
        if(!confirm("Are you sure you want to select this quote?")) return
        setSelectedQuote(prev => {
          prev[idx] = "Selecting..."
          return [...prev]
        })
        try {
          const res = await axios.post(`${server}rfq/select/`,{
            id:quotes[idx].id
          },{
            withCredentials: true
          })
          console.log(res)
          if(res?.status === 200){
            alert(res?.data?.message)
            setSelectedQuote(prev => {
              prev[idx] = "Selected"
              return [...prev]
            })
          }
        } catch (error) {
          console.log(error?.response?.data || error)
          alert("there is a problem while selecting this quote. please try again")
          setSelectedQuote(prev => {
            prev[idx] = "re Select this quote"
            return [...prev]
          })
        }

      })
  return (
    <>
      <div className="step-button" onClick={() => toggleStep(4)}>
      <div className="step-content">
                    <div className='step-inner-content'>
                        <div className="step-header">
                            <div>
                                <span className={processData?.step_three == 'Complete' ? "status-complete" : "status-incomplete"}>{processData.step_three || "pending"}</span>
                                <h3>Quote selection</h3>
                            </div>
                        </div>
                        <hr />
                        <p className="step-description">select the specific quote for approval</p>
                    </div>
                    <span className={expandedStep === 4 ? "chevron-down" : "chevron-right"}>
                    </span>
                </div>
                <div className={`expanded-content ${expandedStep === 4 ? "open" : ""}`}
                onClick={(e)=>e.stopPropagation()}>
                  {
                    quotes.map((quote,index)=>
                    <div className="quotation-buttons" key={index}>
                      <a target="blank" href={quote.sheet} className="view-quote-button">View Quotation</a>
                      <button className="select-quote-button" onClick={() => handleSelectQuote(index)}>{selectedQuote[index] === "Not Selected" ? "select this quote" : selectedQuote[index]}</button>
                    </div>
                    
                    )
                  }
                </div>
      </div>
    </>
  );
}

export default StepThree;
