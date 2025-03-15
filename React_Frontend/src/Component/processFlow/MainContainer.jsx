import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { server } from '../../constant'
import {  useNavigate } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';

const MainContainer = React.memo(({ process,setSelectedProcess,loadInfo }) => {

    const navigate = useNavigate();
    const [processData, setProcessData] = useState(null);
    const [getProcess,setGetProcess] = useState(false)
    const [expandedStep, setExpandedStep] = useState(null)
    const [email, setEmail] = useState("")
    const [showMessageModal, setShowMessageModal] = useState(false)
  const [message, setMessage] = useState("")

  async function loadInformation() {
    try {
        setGetProcess(false)
        const res = await axios.post(`${server}process/get_one/`,{process_id: process},{withCredentials: true})
        // console.log(res.data.process.step_one)
        setProcessData(res.data.process)
        setGetProcess(true)
        
    } catch (error) {
        if(error?.response?.data?.error == 'unauthorize request' && localStorage.getItem('process') !== null){
            localStorage.removeItem('process');
        }
        alert(error?.response?.data?.error)
    }
  }
  useEffect(() => {
    loadInformation()
  },[process])

  const deleteProcess = useCallback(async () => {
    try {
        const res = await axios.delete(`${server}process/delete/`, {
                params: { process_id: process },
                withCredentials: true
            });
        localStorage.removeItem('process');
        await setSelectedProcess(null)
         setProcessData(null)
        loadInfo()
        // alert(res?.data?.message)
    }catch (error) {
        console.log(error?.response?.data?.error || error.response?.data?.message )
    }
  },[process,loadInfo])

  const toggleStep = (stepNumber) => {
    if (expandedStep === stepNumber) {
      setExpandedStep(null)
    } else {
      setExpandedStep(stepNumber)
    }
  }

  const handleAddEmail = () => {
    setEmail("")
  }

  const handleSend = () => {
    console.log("Sending email")
  }

  const handleAddMessage = () => {
    setShowMessageModal(true)
  }

  const handleCloseModal = () => {
    setShowMessageModal(false)
    setMessage("")
  }

  const handleSendMessage = () => {
    setShowMessageModal(false)
    setMessage("")
  }

  const handleResponse = () => {
    console.log("Response action")
  }

  const handleRemove = () => {
    console.log("Remove action")
  }

  
  return (
    getProcess ?
    <>
    <div className="timeline">
        <div className='process-title'>
            <p>{processData?.process_title}</p>
        </div>
        
        <div  className={processData?.step_one =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">1</div>
            <button
            onClick={()=>navigate(`reqSheet/${localStorage.getItem('process')}`)}
                className="step-button"
            >
                <div className="step-content">
                    <div className='step-inner-content'>
                        <div className="step-header">
                            <div >
                                <span className={processData?.step_one == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_one}</span>
                                <h3 >Create your requirement sheet</h3>
                            </div>
                        </div>
                        <hr />
                        <p className="step-description">Specify your requirement, specification and why you need this product</p>
                    </div>
                    <span className="chevron-right"></span>
                </div>
            </button>
        </div>
        <div  className={processData?.step_two =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">2</div>
            <button
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
                        {expandedStep === 2 ? <p className="step-description close">mention the email of the person whose approval is needed</p>
                        :
                        <p className="step-description">mention the email of the person whose approval is needed</p>}
                        
                    </div>
                    <span className={expandedStep === 2 ? "chevron-down" : "chevron-right"}></span>
                </div>
                
               <div className={`expanded-content ${expandedStep === 2 ? "open" : ""}`} onClick={(e)=>e.stopPropagation()}>
               <div className="email-input-container">
                 <input
                   type="email"
                   placeholder="mention the email of the person whose approval is needed"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className='input'
                   required
                 />
                 <button className="add-email-btn" onClick={handleAddEmail}>
                   add email
                 </button>
               </div>
               <div className="action-buttons">
                 <button className="action-btn" onClick={handleSend}>
                   send
                 </button>
                 <button className="action-btn message-btn" onClick={handleAddMessage}>
                   add message
                 </button>
                 <button className="action-btn" onClick={handleResponse}>
                   response
                 </button>
                 <button className="action-btn" onClick={handleRemove}>
                   remove
                 </button>
               </div>
             </div> 
            
            </button>
        </div>
        <div  className={processData?.step_three =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">3</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className='step-inner-content'>
                        <div className="step-header">
                            <div>
                                <span className={processData?.step_three == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_three}</span>
                                <h3>Request for quotations</h3>
                            </div>
                        </div>
                        <hr />
                        <p className="step-description">mention the email of different vendor whose quote you want</p>
                    </div>
                    <span className="chevron-right"></span>
                </div>
            </button>
        </div>
        <div  className={processData?.step_three =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">4</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className='step-inner-content'>
                        <div className="step-header">
                            <div>
                                <span className={processData?.step_three == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_three}</span>
                                <h3>Quote selection</h3>
                            </div>
                        </div>
                        <hr />
                        <p className="step-description">select the specific quote for approval</p>
                    </div>
                    <span className="chevron-right"></span>
                </div>
            </button>
        </div>
        <div  className={processData?.step_four =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">5</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className='step-inner-content'>
                        <div className="step-header">
                            <div>
                                <span className={processData?.step_four == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_four}</span>
                                <h3>Send for final approval</h3>
                            </div>
                        </div>
                        <hr />
                        <p className="step-description">mention the email of the person whose approval is needed</p>
                    </div>
                    <span className="chevron-right"></span>
                </div>
            </button>
        </div>
        <div  className={processData?.step_five =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">6</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                   <div className='step-inner-content'>
                        <div className="step-header">
                            <div>
                                <span className={processData?.step_five == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_five}</span>
                                <h3>Place a purchase Order</h3>
                            </div>
                        </div>
                        <hr />
                        <p className="step-description">auto generate a purchase order and send it to the selected vendor</p>
                    </div>
                    <span className="chevron-right"></span>
                </div>
            </button>
        </div>
    </div>
    <div className='delete-process'>
        <button
        onClick={deleteProcess}
        >Delete this process</button>
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
            <button className="send-message-btn" onClick={handleSendMessage}>
              send
            </button>
          </div>
        </div>
      )}
    </>
    :
    <div className='pro-loader'>
        <ThreeDot color="#d6d6d6" size="small" text="" textColor="" />
    </div>
  )
})
export default MainContainer;
