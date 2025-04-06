import React, { useCallback, useEffect, useRef, useState } from "react";
import { accEmail, server } from "../../constant";
import axios from "axios";
import { encryptData } from "../../util/encryptToken";
import { useNavigate } from "react-router-dom";

export default function StepFour({ processData, user }) {
  const [email, setEmail] = useState([""]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);
  const [message, setMessage] = useState("");
  const [sendBut, setSendBut] = useState("send");
  const [resBut, setResBut] = useState(["response"]);
  const [name, setName] = useState([""]);
  const [approve_email, setApprove_email] = useState();
  const [reqSheet, setReqSheet] = useState(null);

  const printRef = useRef();

  const navigate = useNavigate();

  const loadInfo = useCallback(async () => {
    console.log(processData,"4");

    if (processData.step_two === "Incomplete") {
      return;
    }
    try {
      const res = await axios.get(
        `${server}approve/get/${localStorage.getItem("process")}/`,
        { withCredentials: true }
      );
      console.log(res.data, "data");
      setApprove_email(res.data.data);
      if (res.status === 200) {
        const e = [];
        const r = [];
        const n = [];
        res.data.data.forEach((val) => {
          e.push(val.accepted_by_email);
          r.push(val.status);
          n.push(val.name);
          if(val.type === "Primary"){
            return val.status = "Pending"
          }
        });
        setEmail(e);
        setResBut(r);
        setName(n);
      }
    } catch (error) {
      console.log(error);
    }
  }, [processData]);

  useEffect(() => {
    loadInfo();
    
  }, []);





  const handleSend = useCallback(async () => {
    setSendBut("sending...");

    try {
      let payload;

      if (processData.step_four === "Pending") {
        console.log(resBut);
        for (let i = 0; i < resBut.length; i++) {
          if (resBut[i] === "Pending") {
            console.log(email[i]);
            payload = {
              user: user,
              id: localStorage.getItem("process"),
              processData: processData,
              owner: false,
              email: email[i],
              isFinal: true,
            };
            break;
          }
        }
      } else if (processData.step_four === "Complete") {
        payload = {
          user: user,
          id: localStorage.getItem("process"),
          processData: processData,
          owner: false,
          email: accEmail,
          isFinal: true,
        };
      } else {
        payload = {
          user: user,
          id: localStorage.getItem("process"),
          processData: processData,
          owner: false,
          email: email[0],
          isFinal: true,
        };
      }

      const token = await encryptData(payload);
      console.log(payload);

      if (email.length !== name.length) {
        alert("problem at handling the data at frontend");
        return;
      }
      const newData = [];
      for (let i = 0; i < email.length; i++) {
        if (email[i] === "" || name[i] === "") {
          alert("Please enter an email and name");
          return;
        }
        newData.push({
          email: email[i],
          name: name[i],
          sqe_num: i + 1,
        });
      }

      if (
        !confirm(`Are you sure you want to send this request?${payload.email} `)
      ) {
        return;
      }

    //   const pdf = await generatePdf(printRef);
    //   pdf.append("token", token);
    //   pdf.append("data", JSON.stringify(newData));
    const data = new FormData();
    data.append("token", token);
    data.append("data", JSON.stringify(newData));
      

      const res = await axios.post(`${server}approve/send_for_final/`, data, {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.message === "request send successfully") {
        processData.step_two = "pending";
        alert("request send successfully");
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setSendBut("send");
    }
    // console.log("Sending email",email[i])
  }, [email, message, sendBut]);

  const toggleStep = useCallback(
    (stepNumber) => {
        // console.log(processData);
      if (processData?.step_three !== "Complete") {
        alert("Please complete previous steps first");
        return;
      }
      if (expandedStep === stepNumber) {
        setExpandedStep(null);
      } else {
        setExpandedStep(stepNumber);
      }
    },
    [expandedStep, processData]
  );

  const handleCloseModal = useCallback(() => {
    if (confirm("Are you sure you want to close this without saving")) {
      setShowMessageModal(false);
      setMessage("");
    }
    return;
  }, [showMessageModal]);

  const handleResponse = useCallback(async () => {
    // if(resBut[i] !== 'Accepted' && resBut[i] !== 'Rejected'){
    //   alert("no response available")
    //   // return
    // }
    const payload = {
      user: user,
      id: localStorage.getItem("process"),
      processData: processData,
      owner: true,
      email: email[0],
      isFinal: true,
    };
    const enc = await encryptData(payload);
    navigate(`/approval/${enc}`);
  }, [resBut, email]);

  const handleRemove = useCallback(() => {
    if (email.length === 1) {
      setEmail([""]);
      setName([""]);
      return;
    }
    if (confirm("Are you sure you want to remove this email?")) {
      const e = [...email];
      e.splice(e.length - 1, 1);
      setEmail(e);
    }

    return;
  }, [email]);

  const setEmails = useCallback(
    (i, val) => {
      let e = [...email];
      e[i] = val;
      setEmail(e);
    },
    [email]
  );
  const setNames = useCallback(
    (i, val) => {
      let e = [...name];
      e[i] = val;
      setName(e);
    },
    [name]
  );
  const handleAddEmail = useCallback(() => {
    setEmail([...email, ""]);
    setResBut([...resBut, "response"]);
    setName([...name, ""]);
  }, [email]);

  return (
    <>
      
      <div className="step-button" onClick={() => toggleStep(2)}>
        <div className="step-content">
          <div className="step-inner-content">
            <div className="step-header">
              <div>
                <span
                  className={
                    processData?.step_four == "Complete"
                      ? "status-complete"
                      : "status-incomplete"
                  }
                >
                  {processData?.step_four}
                </span>
                <h3>Send for primary approval</h3>
              </div>
            </div>
            <hr />
            {expandedStep === 2 ? (
              <p className="step-description close">
                mention the email of the person whose approval is needed
              </p>
            ) : (
              <p className="step-description">
                mention the email of the person whose approval is needed
              </p>
            )}
          </div>
          {/* <span className="chevron-right"></span> */}
          <span
            className={expandedStep === 2 ? "chevron-down" : "chevron-right"}
          ></span>
        </div>

        <div
          className={`expanded-content ${expandedStep === 2 ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="add-email-but">
            <button className="add-email-btn" onClick={handleAddEmail}>
              add email
            </button>
          </div>
          {email.map((e, i) => (
            <div key={i} className="email-container">
              <div className="email-input-container">
                <div>{i + 1 + ")"}</div>
                <input
                  placeholder="mention the name or role of that person"
                  type="text"
                  className="input"
                  value={name[i]}
                  onChange={(e) => setNames(i, e.target.value)}
                />
                <input
                  type="email"
                  placeholder="mention the email of the person "
                  value={email[i]}
                  onChange={(e) => setEmails(i, e.target.value)}
                  className="input"
                  required
                />
                {/* <div>
                response
                </div> */}
              </div>
            </div>
          ))}
          <div className="action-buttons">
            <button className="action-btn" onClick={() => handleSend()}>
              {sendBut}
            </button>
            {/* <button className="action-btn message-btn" onClick={()=>setShowMessageModal(true)}>
                    add message
                  </button> */}
            <button
              className={
                // resBut[i] === 'Accepted'? 'action-btn-accepted ' : " action-btn-pending"
                "action-btn-accepted "
              }
              onClick={() => handleResponse()}
            >
              response
            </button>
            <button
              className=" action-btn-pending"
              onClick={() => handleRemove()}
            >
              remove
            </button>
          </div>
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
              placeholder="write something soo person will easily understand what purchase"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              className="send-message-btn"
              onClick={() => setShowMessageModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
