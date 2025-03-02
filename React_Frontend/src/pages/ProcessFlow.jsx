// ProcessFlow.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/ProcessFlow.css';
import { server } from '../constant';
import axios from 'axios';
import MainContainer from '../Component/processFlow/MainContainer';

export default function ProcessFlow() {
    const navigate = useNavigate();
    const [process, setProcess] = useState([]);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [user, setUser] = useState(null);



    async function loadInformation() {
        if(localStorage.getItem('process') !== null){
            setSelectedProcess(localStorage.getItem('process'))
        }
        try {

            const [pro, user ] = await axios.all([
                axios.get(`${server}process/get_all/`,{
                    withCredentials: true
                }),
                axios.get(`${server}auth/get/`,{
                    withCredentials: true
                })
            ])
            console.log(pro)
            if(user?.data !== null){
                setUser(user.data)
                
            }
            
            // console.log(res.data?.process)
            if(pro.data?.process?.length > 0){
                setProcess(pro.data?.process)
            }
            // console.log(process)
        } catch (error) {
            
        }
    }
   useEffect(() => {
        loadInformation()
        
    }, [])
   
   



    const isComplete = useCallback((pro) => {
        if(pro.step_five === "Complete" && pro.step_four === "Complete" && pro.step_three === "Complete" && pro.step_two == "Complete" && pro.step_one === "Complete"){
            return true
        }else{
            return false
        }
    },[])

    
    
    const selectProcess = useCallback((pro) => {
        setIsNavOpen(!isNavOpen)
        setSelectedProcess(pro.process_id)
        localStorage.setItem('process', pro.process_id)
    },[isNavOpen])

    async function logout(){
        try {
            const res = await axios.get(`${server}auth/logout/`,{
                withCredentials: true
            })
            if(res.data.message === 'logout successfully'){
                localStorage.removeItem('process');
                navigate("/auth/login")
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    
    return (
        <div className="app-container">
            {/* Sidebar Navigation */}
            <div className={`sidebar ${isNavOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                <div className="user-profile">
                        <div className="avatar">
                            <img src={user?.gender == 'male' ? '/boy.png' : '/girl.png'} alt="" className='avatar'/>
                        </div>
                        <div className="user-info">
                            <h2>{ user?.username||"Username"}</h2>
                            <p>{user?.email||'abd@gmil.com'}</p>
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
                </div>
                    <button className="logout-button" onClick={logout}>
                        Log out
                    </button>
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

                    {
                        selectedProcess === null ? (
                            <p 
                            className='no-process-selected'
                            onClick={() => setIsNavOpen(!isNavOpen)}>select the process first</p>
                        ):(
                            <MainContainer process={selectedProcess} />
                        )
                    }   

                    {/* <MainContainer process={5} /> */}
                </div>
            </div>
        </div>
    );
}