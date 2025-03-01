// ProcessFlow.jsx
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/ProcessFlow.css';
import { server } from '../constant';
import axios from 'axios';
import { use } from 'react';

export default function ProcessFlow() {
    const navigate = useNavigate();
    const [process, setProcess] = useState([]);
    const [isNavOpen, setIsNavOpen] = useState(false);



    async function loadInformation() {
        try {
            const res = await axios.get(`${server}process/get_all/`,{
                withCredentials: true
            })
            // console.log(res.data?.process)
            if(res.data?.process?.length > 0){
                setProcess(res.data?.process)
            }
            // console.log(process)
        } catch (error) {
            
        }
    }
   useEffect(() => {
        loadInformation()
    }, [])
    useEffect(() => {
        console.log(process)
    },[process])



    const isComplete = useCallback((pro) => {
        if(pro.step_five === "Complete" && pro.step_four === "Complete" && pro.step_three === "Complete" && pro.step_two == "Complete" && pro.step_one === "Complete"){
            return true
        }else{
            return false
        }
    },[])

    const selectProcess = useCallback((pro) => {
        console.log(pro.process_id)
    },[])

    async function logout(){
        try {
            const res = await axios.get(`${server}auth/logout/`,{
                withCredentials: true
            })
            if(res.data.message === 'logout successfully'){
                navigate("/auth/login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const steps = [
        {
            number: "1",
            title: "Create your requirement sheet",
            description: "Specify your requirement, specification and why you need this product",
            path: "/create-requirement"
        },
        {
            number: "2",
            title: "Send for primary approval",
            description: "mention the email of the person whose approval is needed",
            path: "/primary-approval"
        },
        {
            number: "3",
            title: "Request for quotetaion",
            description: "mention the email of different vendor whose quote you want",
            path: "/request-quotation"
        },
        {
            number: "4",
            title: "Quote selection",
            description: "select the specific quote for approval",
            path: "/quote-selection"
        },
        {
            number: "5",
            title: "Send for final approval",
            description: "mention the email of the person whose approval is needed",
            path: "/final-approval"
        },
        {
            number: "6",
            title: "Place a purchase Ordeer",
            description: "auto genrate a purchase order and send it to the selected vendor",
            path: "/purchase-order"
        }
    ];

    return (
        <div className="app-container">
            {/* Sidebar Navigation */}
            <div className={`sidebar ${isNavOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                <div className="user-profile">
                        <div className="avatar"></div>
                        <div className="user-info">
                            <h2>Username</h2>
                            <p>abd@gmil.com</p>
                        </div>
                    </div>
                    <div className="process-controls">
                        <div className="select-process">
                            <input className='process-select' type="text" placeholder="select the Process" />
                            <button className="add-button"><img src="react.svg" alt="" /></button>
                        </div>
                        <div className="title-inputs">
                            {process.map((pro, index) => (
                                <div 
                                onClick={()=>{selectProcess(pro)}}
                                key={index} 
                                className={isComplete(pro)? 'Process complete-border' : 'Process incomplete-border'} >
                                    <div className='process-state'>
                                        <div className={isComplete(pro) ? "complete circle" : "incomplete circle"}>
                                        </div>
                                            <p>{isComplete(pro) ? "completed" : "on the way"}</p>
                                    </div>
                                    <div className="title-input">
                                        <p>{pro.process_title}</p>
                                        <span className="chevron-right"></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="logout-button" onClick={logout}>
                        Log out
                    </button>
                </div>
            </div>

            <div className="main-content">
                {/* Header */}
                
                    
                    <button
                        className={`menu-toggle ${isNavOpen ? 'open' : ''}`}
                        onClick={() => setIsNavOpen(!isNavOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
               

                {/* Main Process Flow */}
                <div className="process-flow">
                    <div className="title-section">
                        <h1>“Your Seamless Path to Completing a Perfect Quotation Purchase – Simple, Fast, and Secure!”</h1>
                        <img
                            src="/process_illustration.jpeg"
                            alt="Process illustration"
                            className="illustration"
                        />
                    </div>

                   

                    <div className="timeline">
                        {steps.map((step, index) => (
                            <div key={index} className="timeline-item">
                                <div className="step-number">{step.number}</div>
                                <button
                                    className="step-button"
                                    onClick={() => navigate(step.path)}
                                >
                                    <div className="step-content">
                                        <div className="step-header">
                                            <span className="status">pending</span>
                                            <h3>{step.title}</h3>
                                            <span className="chevron-right"></span>
                                        </div>
                                        <p className="step-description">{step.description}</p>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>

                    
                </div>
            </div>
        </div>
    );
}