import ChatBox from "../Component/reqSheet/Chatbox";
import { useCallback, useEffect, useState } from "react";
import "../CSS/ReqSheet.css";
import Toast from "../Component/reqSheet/Toast";
import axios from "axios";
import { server } from "../constant";
import { useParams } from "react-router-dom";
import EditableTable from "../Component/reqSheet/EditTable";
import { useNavigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";
import Checkbox from "/src/Component/reqSheet/Checkbox";
import RenderTable from "../Component/reqSheet/RenderTable";

const ReqSheet = () => {
  const [skuValue, setSkuValue] = useState("  ");
  const [department, setDepartment] = useState("  ");
  const [justification, setJustification] = useState("  ")
  const [requirementText, setRequirementText] = useState("");
  const [disable, setDisable] = useState(false);
  const [finalData, setFinalData] = useState();
  const [getReq, setGetReq] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  const { proId } = useParams();

  const navigate = useNavigate();

  const loadInfo = useCallback(async () => {
    try {
      const res = await axios.get(`${server}stepOne/get/${proId}/`, {
        withCredentials: true,
      });
      if (res.data.message === "successfully fetched the data") {
        setSkuValue(res?.data?.data?.SKU);
        setRequirementText(JSON.parse(res?.data?.data.requirementSHeet));

        const a = res?.data?.data?.type_of_item;
        setSelectedValues(JSON.parse(a.replace(/'/g, '"')));
        setJustification(res?.data?.data?.justification_for_indenting);
        setDepartment(res?.data?.data?.indenting_department);
      }
      console.log(res.data.data);
     

      setDisable(res?.data?.data?.owner || false);
      setGetReq(true);
    } catch (error) {
      console.log(error.response || error.response);
      setGetReq(true);

      // navigate("/")
    }
  }, []);

  useEffect(() => {
    loadInfo();
  }, []);


  
 
  
  const handleSubmit = useCallback(async(e) => {
    e.preventDefault();
    if( skuValue === ""){
      alert("please fill all the places")
      return
    }
    try {
      const res = await axios.post(`${server}stepOne/save/`,{
        requirementSHeet:JSON.stringify(finalData),
        SKU:skuValue,
        indenting_department:department,
        justification_for_indenting:justification,
        type_of_item:selectedValues
      },{withCredentials: true});
      alert(res.data.message)
      
    } catch (error) { 
      if(error?.response?.data?.message == "SKU already exists"){
        alert("SKU already exists please give unique SKU")
      }
      console.log(error)
    }
  },[requirementText,skuValue,finalData,selectedValues,department,justification]);


  const deleteStepOne = useCallback(async () => {
    alert("are you sure! do you really want to delete this step");
    try {
      const res = await axios.delete(`${server}stepOne/delete/`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleCheckboxChange = (event) => {
    console.log(selectedValues)
    const { value, checked } = event.target;
    setSelectedValues((prevValues) =>
      checked ? [...prevValues, value] : prevValues.filter((v) => v !== value)
    );
    
  };



  return getReq ? (
    <div className="req-sheet-container">
      <div className={`main-content-reqSheet`}>
        {/* Form */}
        
          <form onSubmit={handleSubmit}>
            <div className={`form-section`}>
              <h2 className="section-title">STOCK KEEPING UNIT</h2>
              <input
                type="text"
                className="section-input"
                placeholder="mention your SKU"
                value={skuValue}
                onChange={(e) => setSkuValue(e.target.value)}
              />
              <h2 className="section-title">INDENTING DEPARTMENT</h2>
              <input
                type="text"
                className="section-input"
                placeholder="mention department name"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <h2 className="section-title">TYPE OF ITEMS</h2>
              <div className="checkbox-options">
                <div className="checkbox-column">
                  <Checkbox
                    label="Consumable"
                    value="consumable"
                    checked={selectedValues.includes("consumable")}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label="Stationary"
                    value="stationary"
                    checked={selectedValues.includes("stationary")}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label="Furniture"
                    value="furniture"
                    checked={selectedValues.includes("furniture")}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label="Spares"
                    value="spares"
                    checked={selectedValues.includes("spares")}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label="Capital Equipment"
                    value="capital_equipment"
                    checked={selectedValues.includes("capital_equipment")}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label="Other"
                    value="other"
                    checked={selectedValues.includes("other")}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label="Printing"
                    value="printing"
                    checked={selectedValues.includes("printing")}
                    onChange={handleCheckboxChange}
                  />
                  <Checkbox
                    label="Capital Other"
                    value="capital_other"
                    checked={selectedValues.includes("capital_other")}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>

              <h2 className="section-title">REQUIREMENT SHEET</h2>
             
                  <div className="table-container">
                  <EditableTable tableData={requirementText} setFinalData={setFinalData} />
                  </div>
                
              <h2 className="section-title">JUSTIFICATION FOR INDENTING</h2>
              <textarea
                name="justification"
                className="justification-textarea"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              ></textarea>
            </div>
          </form>

        <button type="submit" onClick={handleSubmit} className="submit-button">
          submit
        </button>
      </div>
    </div>
  ) : (
    <ThreeDot color="#d6d6d6" size="small" text="" textColor="" />
  );
};

export default ReqSheet;
