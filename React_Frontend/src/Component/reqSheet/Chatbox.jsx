import React, { useCallback, useState } from 'react'

export default function ChatBox({isSidebarOpen,setSidebarOpen,handleInsert}) {
    const [chatbot, setChatbot] = useState(false)
    const [userInput, setUserInput] = useState("");

    
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSendMessage = useCallback((e) => {
        e.preventDefault();
        setUserInput("");
        setChatbot(true);
    },[chatbot,userInput]);

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
            <div className="chat-initial">
              <h1 className="chat-title">Hey there,</h1>
              <h1 className="chat-title">what is your use case?</h1>
              <p className="chat-description">
                Just tell me about your use case and I will suggest you a nice requirement
              </p>
            </div>
          ) : (
            <div className="chatbot">
              <p className="chat-paragraph">
                Crafted passionately by our team, where boundless imagination fuels groundbreaking innovation, this
                project is not just a design, but a revolution in the making! SayHello redefines the future of digital
                interaction with seamless, intelligent conversations that elevate user experience to new heights. With
                cutting-edge AI capabilities, SayHello ensures every interaction is insightful, responsive, and
                engaging.
              </p>
              <button className="insert-button" onClick={handleInsert}>
                insert
              </button>
            </div>
            
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
