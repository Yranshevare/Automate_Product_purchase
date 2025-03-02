import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { server } from '../../constant'
import { use } from 'react';

const MainContainer = React.memo(({ process,setSelectedProcess,loadInfo }) => {
    // console.log(setOpen)
    const [processData, setProcessData] = useState(null);
  async function loadInformation() {
    try {
        const res = await axios.post(`${server}process/get_one/`,{process_id: process},{withCredentials: true})
        // console.log(res.data.process.step_one)
        setProcessData(res.data.process)
        
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
        console.log(error)
        console.log(error?.response?.data?.error || error.response?.data?.message )
    }
  },[process,loadInfo])
//   async function deleteProcess() {
//     console.log(process)
//     try {
//         // const res = await axios.delete(`${server}process/delete/`, {
//         //     params: { process_id: process },
//         //     withCredentials: true
//         // });
//         console.log(res.data)
//         setProcessData(null)
//         await setOpen(null)
//         console.log(process)
//         console.log(setOpen)
//         console.log(loadInfo)
//         loadInfo()
//         localStorage.removeItem('process');
//         alert(res?.data?.message)
//     }catch (error) {
//         console.log(error?.response?.data?.error || error.response?.data?.message )
//     }
//   }
  
  return (
    <>
    <div className="timeline">
        <div className='process-title'>
            <p>{processData?.process_title}</p>
        </div>
        
        <div  className={processData?.step_one =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">1</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className="step-header">
                        <span className={processData?.step_one == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_one}</span>
                        <h3>Create your requirement sheet</h3>
                        <span className="chevron-right"></span>
                    </div>
                    <p className="step-description">Specify your requirement, specification and why you need this product</p>
                </div>
            </button>
        </div>
        <div  className={processData?.step_two =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">2</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className="step-header">
                        <span className={processData?.step_two == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_two}</span>
                        <h3>Send for primary approval</h3>
                        <span className="chevron-right"></span>
                    </div>
                    <p className="step-description">mention the email of the person whose approval is needed</p>
                </div>
            </button>
        </div>
        <div  className={processData?.step_three =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">3</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className="step-header">
                        <span className={processData?.step_three == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_three}</span>
                        <h3>Request for quotations</h3>
                        <span className="chevron-right"></span>
                    </div>
                    <p className="step-description">mention the email of different vendor whose quote you want</p>
                </div>
            </button>
        </div>
        <div  className={processData?.step_three =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">4</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className="step-header">
                        <span className={processData?.step_three == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_three}</span>
                        <h3>Quote selection</h3>
                        <span className="chevron-right"></span>
                    </div>
                    <p className="step-description">select the specific quote for approval</p>
                </div>
            </button>
        </div>
        <div  className={processData?.step_four =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">5</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className="step-header">
                        <span className={processData?.step_four == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_four}</span>
                        <h3>Send for final approval</h3>
                        <span className="chevron-right"></span>
                    </div>
                    <p className="step-description">mention the email of the person whose approval is needed</p>
                </div>
            </button>
        </div>
        <div  className={processData?.step_five =='Complete' ? "timeline-item complete-border" : "timeline-item incomplete-border"}>
            <div className="step-number">6</div>
            <button
                className="step-button"
            >
                <div className="step-content">
                    <div className="step-header">
                        <span className={processData?.step_five == 'Complete' ? "status-complete" : "status-incomplete"}>{processData?.step_five}</span>
                        <h3>Place a purchase Order</h3>
                        <span className="chevron-right"></span>
                    </div>
                    <p className="step-description">auto generate a purchase order and send it to the selected vendor</p>
                </div>
            </button>
        </div>
    </div>
    <div className='delete-process'>
        <button
        onClick={deleteProcess}
        >Delete this process</button>
    </div>
    </>
  )
})
export default MainContainer;
