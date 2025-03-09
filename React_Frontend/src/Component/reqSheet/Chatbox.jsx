import React, { useCallback, useEffect, useState } from 'react'
import ChatLoadingAnimation from './ChatLoadingAnimation';
import axios from 'axios';
import { server } from '../../constant';
import markdownit from 'markdown-it'

const md = markdownit()

export default function ChatBox({isSidebarOpen,setSidebarOpen,setRequirementText}) {
    const [chatbot, setChatbot] = useState(false)
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleInsert = () => {
      const sampleText = message
      setRequirementText((prev) => (prev ? `${prev}\n\n${sampleText}` : sampleText))
      setSidebarOpen(!isSidebarOpen);
    }

    
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSendMessage = useCallback(async(e) => {
        e.preventDefault();
        if(userInput == ""){
          alert("please provide some information")
          return
        }
        if(chatbot){
            setChatbot(false);
        }
        const mes = userInput
        setUserInput("");
        setLoading(true);

        try {
            const res = await axios.get(`${server}stepOne/generate/`,{
              params:{message:mes},
              withCredentials: true
            })
            setChatbot(true);

            const result = md.render(res.data.response);
            const plainText = result.replace(/<[^>]*>/g, '').trim();

            setMessage(plainText);
            // console.log(res.data)
        } catch (error) {
          alert(error?.response?.data?.message)
        }
        finally{  
          setLoading(false);
        }

    },[chatbot,userInput,loading,message]);

  return (
    <>
      {isSidebarOpen ? (
        <div className={`sidebar-toggle open`} onClick={toggleSidebar}>
          &gt;
        </div>
      ) : (
        <div className={`sidebar-toggle`} onClick={toggleSidebar}>
          &lt;
        </div>
      )}
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
        
        {!chatbot ? (
            
            loading ? <ChatLoadingAnimation/> :
              <div className="chat-initial">
                <h1 className="chat-title">Hey there,</h1>
                <h1 className="chat-title">what is your use case?</h1>
                <p className="chat-description">
                  Just tell me about your use case and I will suggest you a nice requirement
                </p>
              </div> 
          ) : (
            <>
            <div className="chatbot">
              <div >
                <pre className="chat-paragraph">
                  {message}
                </pre>
              </div>
              <button className="insert-button" onClick={handleInsert}>
                insert
              </button>
            </div>
            </>
            
          )}
        </div>
        <form className="chat-input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="specify your use case here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit" className="arrow-up-button">
            <img
              src="/arrow-up-icon.svg"
              alt="Arrow Up Icon"
              className="arrow-up-icon"
            />
          </button>
        </form>
      </div>
    </>
  )
}
