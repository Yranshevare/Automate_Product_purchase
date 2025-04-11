import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { server } from "../../constant";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import StepTwo from "./stepTwo";
// import StepThree from './StepThree';
import StepThree from "./StepThree";
import StepFour from "./stepFour";
import StepFive from "./StepFive";

const MainContainer = React.memo(
  ({ process, setSelectedProcess, loadInfo, user }) => {
    const navigate = useNavigate();
    const [processData, setProcessData] = useState(null);
    const [getProcess, setGetProcess] = useState(false);

    async function loadInformation() {
      try {
        setGetProcess(false);
        const res = await axios.post(
          `${server}process/get_one/`,
          { process_id: process },
          { withCredentials: true }
        );
        // console.log(res.data.process.step_one)
        setProcessData(res.data.process);
        setGetProcess(true);
      } catch (error) {
        if (
          error?.response?.data?.error == "unauthorize request" &&
          localStorage.getItem("process") !== null
        ) {
          localStorage.removeItem("process");
        }
        alert(error?.response?.data?.error);
      }
    }
    useEffect(() => {
      loadInformation();
    }, [process]);

    const deleteProcess = useCallback(async () => {
      try {
        const res = await axios.delete(`${server}process/delete/`, {
          params: { process_id: process },
          withCredentials: true,
        });
        localStorage.removeItem("process");
        await setSelectedProcess(null);
        setProcessData(null);
        loadInfo();
        // alert(res?.data?.message)
      } catch (error) {
        console.log(
          error?.response?.data?.error || error.response?.data?.message
        );
      }
    }, [process, loadInfo]);

    return getProcess ? (
      <>
        <div className="timeline">
          <div className="process-title">
            <p>{processData?.process_title}</p>
          </div>

          <div
            className={
              processData?.step_one == "Complete"
                ? "timeline-item complete-border"
                : "timeline-item incomplete-border"
            }
          >
            <div className="step-number">1</div>
            <button
              onClick={() =>
                navigate(`reqSheet/${localStorage.getItem("process")}`)
              }
              className="step-button"
            >
              <div className="step-content">
                <div className="step-inner-content">
                  <div className="step-header">
                    <div>
                      <span
                        className={
                          processData?.step_one == "Complete"
                            ? "status-complete"
                            : "status-incomplete"
                        }
                      >
                        {processData?.step_one}
                      </span>
                      <h3>Create your requirement sheet</h3>
                    </div>
                  </div>
                  <hr />
                  <p className="step-description">
                    Specify your requirement, specification and why you need
                    this product
                  </p>
                </div>
                <span className="chevron-right"></span>
              </div>
            </button>
          </div>
          <div
            className={
              processData?.step_two == "Complete"
                ? "timeline-item complete-border"
                : "timeline-item incomplete-border"
            }
          >
            <div className="step-number">2</div>
            <StepTwo processData={processData} user={user} />
          </div>
         
          <div
            className={
              processData?.step_three == "Complete"
                ? "timeline-item complete-border"
                : "timeline-item incomplete-border"
            }
          >
            <div className="step-number">3</div>
            <StepThree processData={processData} />
          </div>
          <div
            className={
              processData?.step_four == "Complete"
                ? "timeline-item complete-border"
                : "timeline-item incomplete-border"
            }
          >
            <div className="step-number">4</div>
           
            <StepFour processData={processData} user={user}/>
          </div>
          <div
            className={
              processData?.step_five == "Complete"
                ? "timeline-item complete-border"
                : "timeline-item incomplete-border"
            }
          >
            <div className="step-number">5</div>
            <StepFive/>
          </div>
        </div>
        <div className="delete-process">
          <button onClick={deleteProcess}>Delete this process</button>
        </div>
      </>
    ) : (
      <div className="pro-loader">
        <ThreeDot color="#d6d6d6" size="small" text="" textColor="" />
      </div>
    );
  }
);
export default MainContainer;
