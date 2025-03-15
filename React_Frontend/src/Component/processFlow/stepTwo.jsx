import React, { useCallback, useEffect, useState } from 'react'

export default function StepTwo({processData}) {
    const [email, setEmail] = useState([""])
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [expandedStep, setExpandedStep] = useState(null)
    const [message, setMessage] = useState("")
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.message-modal')) {
                setShowMessageModal(false)
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    },[])
    
    
   
    
    
    
    const handleSend = useCallback(async(i) => {
        if(email[i] === ""){ 
            alert("Please enter an email")
            return
        }
        console.log("Sending email",email[i])
        console.log(message,"message")
    },[email,message])


    const toggleStep = useCallback((stepNumber) => {
        if (expandedStep === stepNumber) {
          setExpandedStep(null)
          
        } else {
          setExpandedStep(stepNumber)
        }
        
    },[expandedStep])
    

    const handleCloseModal = useCallback(() => {
        if(confirm("Are you sure you want to close this without saving")){
            setShowMessageModal(false)
            setMessage("")
        }
        return
       
    },[showMessageModal])
    

    const handleResponse = (i) => {
      console.log("Response action",email[i])
    }



    const handleRemove = useCallback((i) => {
        if(email.length === 1){
            setEmail([""])
            return
        }
        if(confirm("Are you sure you want to remove this email?")){
            const e = [...email]
            e.splice(i, 1)
            setEmail(e)
        }
        return
    },[email])

    const setEmails = useCallback((i,val) => {
        let e = [...email]
        e[i] = val
        setEmail(e)
    },[email])

    const handleAddEmail = useCallback(() => {
        setEmail([...email, ""]);
    },[email])


  return (
    <>
    <div
        className="step-button" onClick={()=>toggleStep(2)}
    >
    <div className="step-content">
        <div className='step-inner-content'>
            <div className="step-header">
                <div>
                    <span className={processData?.step_two == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_two}</span>
                    <h3>Send for primary approval</h3>
                </div>
            </div>
            <hr />
            {
                expandedStep === 2 ? <p className="step-description close">mention the email of the person whose approval is needed</p>
                :
                <p className="step-description">mention the email of the person whose approval is needed</p>
            }
            
        </div>
        {/* <span className="chevron-right"></span> */}
        <span className={expandedStep === 2 ? "chevron-down" : "chevron-right"}></span>
    </div>
    
    <div className={`expanded-content ${expandedStep === 2 ? "open" : ""}`} onClick={(e)=>e.stopPropagation()}>
        <div className='add-email-but'>
            <button className="add-email-btn" onClick={handleAddEmail}>
                    add email
            </button>
        </div>
        {
            email.map((e,i) => 
                <div key={i } className='email-container'>
                <div className="email-input-container" >
                <input
                  type="email"
                  placeholder="mention the email of the person whose approval is needed"
                  value={email[i]}
                  onChange={(e) => setEmails(i,e.target.value)}
                  className='input'
                  required
                />
            
                </div>
                <div className="action-buttons">
                  <button className="action-btn" onClick={()=>handleSend(i)}>
                    send
                  </button>
                  <button className="action-btn message-btn" onClick={()=>setShowMessageModal(true)}>
                    add message
                  </button>
                  <button className="action-btn" onClick={()=>handleResponse(i)}>
                    response
                  </button>
                  <button className="action-btn" onClick={()=>handleRemove(i)}>
                    remove
                  </button>
                </div>
                </div>
            )
        }
        
    </div> 
    </div>
    {showMessageModal && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <button className="close-modal-btn" onClick={handleCloseModal}>
              ×
            </button>
            <textarea
              className="message-textarea"
              placeholder="write someting soo person will esaily understand what purchase"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button className="send-message-btn" onClick={()=>setShowMessageModal(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}
