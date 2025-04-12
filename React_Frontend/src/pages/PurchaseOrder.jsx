import React, { useEffect, useState } from "react";
import '../CSS/PurchaseOrder.css';
import EditableTable from "../Component/reqSheet/EditTable";

function PurchaseOrder() {
  let currentDate = new Date(); // Outputs the full date and time
  // let dateOnly = currentDate.toDateString();  // Example: "Wed Mar 26 2025"
  let formattedDate = currentDate.toISOString().split('T')[0];  // Example: "2025-03-26"


  const [formData, setFormData] = useState({
    orderNumber: "",
    to: "",
    poDate: formattedDate,
    name: "",
    email: "",
    phone: "",
  });

  const [requirementText, setRequirementText] = useState({
    headers:["unit","Description","Unit Price","Total Amount"],
    items:[{"unit":'',"Description":'',"Unit Price":'',"Total Amount":''},
            {"unit":'subtotal 1', "Description":0},
            {"unit":'Discount', "Description":0},
            {"unit":'subtotal 2', "Description":0},
            {"unit":'GST TAX ADD 18%', "Description":0},
            {"unit":'Subtotal 3', "Description":0},
    ]
  }); // Initialize tableData, 
  const [finalData, setFinalData] = useState();

  const [terms, setTerms] = useState([{"":""}]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (finalData?.items.length > 6 && finalData?.items[finalData?.items.length -1].unit === ""){

      const newIndex = Math.max((finalData?.items.length -1) - 5, 0);

      const [item] = finalData?.items.splice((finalData?.items.length -1), 1);

      finalData?.items.splice(newIndex, 0, item);
      setRequirementText(finalData)
      
    }
    
    for(let i = 0; i < finalData?.items.length-5; i++){
      if(finalData?.items[i].unit !== "" && finalData?.items[i]["Unit Price"] !== "" ){
        finalData.items[i]["Total Amount"] = String(finalData?.items[i].unit * finalData?.items[i]["Unit Price"]);
      }
      
      setRequirementText(finalData)
    }
    let subtotal_1 = 0
    for(let i = 0; i < finalData?.items.length-5; i++){
      if(finalData?.items[i]["Total Amount"] !== ""  ){
        subtotal_1 += parseFloat(finalData?.items[i]["Total Amount"]);
      }
    }


    if (finalData && finalData.items && finalData.items.length >= 5) {
      finalData.items[finalData.items.length - 5]["Description"] = subtotal_1;
    }

    if (finalData && finalData.items && finalData.items[finalData.items.length - 4]["Description"] !== 0)  {
      let subtotal_2 = finalData.items[finalData.items.length - 5]["Description"] - finalData.items[finalData.items.length - 4]["Description"];
      finalData.items[finalData.items.length - 3]["Description"] = subtotal_2;
    }

    if(finalData && finalData.items){
      let gst = finalData.items[finalData.items.length - 3]["Description"] * 0.18;
      finalData.items[finalData.items.length - 2]["Description"] = gst;
      finalData.items[finalData.items.length - 1]["Description"] = finalData.items[finalData.items.length - 3]["Description"] + finalData.items[finalData.items.length - 2]["Description"];
    }

  }, [finalData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(finalData)
    console.log(formData)
    console.log(terms)
  };


  const handleKeyChange = (key,idx) => {

    const newTerms = {...terms[idx]};


    newTerms[key] = newTerms[Object.keys(newTerms)[0]]
    delete newTerms[Object.keys(newTerms)[0]]

    const newObj = [...terms];
    newObj[idx] = newTerms;
    setTerms(newObj);

  };
  const handleValueChange=(val,idx) => {
    const newTerms = {...terms[idx]};

    newTerms[Object.keys(newTerms)[0]] = val


    const newObj = [...terms];
    newObj[idx] = newTerms;
    setTerms(newObj);
    // setTerms({...terms,[key]:val})
  }

  const addTerm = () => {
    const newTerms = [...terms];
    newTerms.push({"":""});
    setTerms(newTerms);
  };

  return (
    <div className="purchase-order-container">
      {/* Header */}
      <div className="header">
        <div className="college-info">
          <h1 className="college-name">TERNA COLLAGE OF ENGINEERING</h1>
          <p className="college-address">Nerul (W), navi mumbai - 400706</p>
        </div>
        <div className="user-info">
          <div className="user-details">
            <h2 className="username">username</h2>
            <p className="user-email">abc@gmail.com</p>
          </div>
          <div className="avatar"></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="orderNumber" className="form-label">
              PURCHASE ORDER NUMBER:
            </label>
            <input
              type="text"
              id="orderNumber"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="poDate" className="form-label">
              PO Date:
            </label>
            <input
              type="date"
              id="poDate"
              name="poDate"
              value={formData.poDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="to" className="form-label">
              TO:
            </label>
            <textarea
              id="to"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>
          <div className="form-group-stack">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                NAME:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                EMAIL:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                PHONE:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

          <div className="table-container">
            <EditableTable tableData={requirementText} setFinalData={setFinalData} />
          </div>
        {/* <div className="div-box"></div> */}
        <div className="terms-conditions-container">
          <div className="terms-conditions-header">
            <label className="form-label">TERMS AND CONDITIONS</label>
            <button onClick={addTerm}>add</button>
          </div>
          {
              terms.map((val,idx) => (
                <div className="terms-conditions">
            
                  <input 
                    value={Object.keys(val)[0]}
                    className="section-input"
                    type="text"
                    placeholder="enter the terms and condition" 
                    onChange={(e) => handleKeyChange(e.target.value, idx)}
                  />
                  <input 
                    value={val[Object.keys(val)[0]]}
                    className="section-input"
                    type="text"
                    placeholder="enter the terms and condition" 
                    onChange={(e) => handleValueChange(e.target.value,idx)}
                  />
                </div>
              ))
            }
          {/* <div className="terms-conditions">
            
            <input 
            className="section-input"
            type="text"
            placeholder="enter the terms and condition" />
            <input 
            className="section-input"
            type="text"
            placeholder="enter the terms and condition" />
          </div> */}
        </div>


        <div className="submit-container">
          <button type="submit" className="submit-button">
            submit
          </button>
        </div>

        {/* Footer Signatures */}
        <div className="signature-sections">
        <div className="signatures-row">
          <div className="signature-box">
            <div className="signature-line">prespred by - store keeper</div>
          </div>
          <div className="signature-box">
            <div className="signature-line">Recived by</div>
          </div>
        </div>
        <div className="signatures-row">
          <div className="signature-box">
            <div className="signature-line">Recomended by</div>
          </div>
          <div className="signature-box">
            <div className="signature-line">principle</div>
          </div>
        </div>
        </div>
      </form>
    </div>
  );
}

export default PurchaseOrder;
