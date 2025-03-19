import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import DeleteRowMenu from './DeleteRowMenu';
import ColumnMenu from './ColumnMenu';

function EditableTable({tableData,setFinalData}) {
  
  const initialState = {
    headers:["sr no.","Particulars with Specifications","Existing if any","Quantity","Estimated Cost","Remark"],
    items:[{"sr no.":'1',"Particulars with Specifications":'',"Existing if any":'',"Quantity":'',"Estimated Cost":'',"Remark":''}]
  }


  const [data, setData] = useState();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isMenuColVisible, setMenuColVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [index , setIndex] = useState(null)
  

  const setWidth = useCallback((index) => {
    if(index == 0){
      return "50px"
    }else if(index == 1){
      return "300px"
    }else if(index == 2){
      return "150px"
    }else if(index == 3){
      return "100px"
    }else if(index == 4){
      return "150px"
    }else if(index == 5){
      return "100px"
    }
    else{
      return "200px"
    }
  },[])




  useEffect(() => {
      setData(tableData ||initialState)
  },[tableData])

  useEffect(() => {
      setFinalData(data)
  },[data])


  const handleCellEdit = useCallback((rowIndex, colKey, value) => {
    const updatedData = [...data.items];
    updatedData[rowIndex][colKey] = value;
    setData({...data, items: updatedData});
  },[data]);

  const changeHeader = useCallback((idx , value) => {
    const updatedData = [...data.headers];
    const head = updatedData[idx]
    data.items.map(item => {
      const val = item[head]
      delete item[head]
      updatedData[idx] = value;
      item[updatedData[idx]]  = val
      return item
    })
    setData({...data, headers: updatedData});
  },[data])

  const addColumn = useCallback(() => {
    const updatedData = [...data.headers];
    updatedData.push("");
    setData({...data, headers: updatedData});
  },[data])

  const addRow = useCallback(() => {
    const emptyObj = {}
    const updatedData = [...data.items];
    data.headers.map(header => emptyObj[header] = '')
    emptyObj["sr no."]= data.items.length+1
    updatedData.push(emptyObj);
    setData({...data, items: updatedData});
  },[data])


  // function to open the row menu on right click
  const openRowMenu = useCallback((idx) => {
    if(isMenuColVisible){
      setMenuColVisible(false)
    }
    setMenuVisible(true)
    setMenuPosition({x: event.clientX, y: event.clientY})
    setIndex(idx)
  },[data,isMenuColVisible])


  //function to shift row at left side
  const shiftRowLeft = useCallback((idx) => {
    setMenuVisible(false)
    if(idx-1 < 0){
      alert("cannot shift left")
      return;
    }
    const head = [...data.headers];
    const curr = head[idx]
    head[idx] = head[idx-1]
    head[idx-1] = curr
    setData({...data,headers:head})
  },[data,isMenuColVisible])

  //function to move the row at right side
  const shiftRowRight = useCallback((idx) => {
    setMenuVisible(false)
    if(idx == data.headers.length-1){
      alert("cannot shift right")
      return;
    }
    const head = [...data.headers];
    const curr = head[idx]
    head[idx] = head[idx+1]
    head[idx+1] = curr
    setData({...data,headers:head})
  },[data,isMenuColVisible])

  //function to delete the row
  const deleteRow = useCallback((index) => {
    setMenuVisible(false)
    if(data.headers.length == 1){
      alert("cannot be delete")
      return
    }
    const head = [...data.headers];
    data.items.map(item => delete item[head[index]])
    head.splice(index,1)
    setData({...data,headers:head})
  },[data,isMenuColVisible])

  //function to open columns menu on right click
  const openColMenu = useCallback((idx) => {
    if(isMenuVisible){
      setMenuVisible(false)
    }
    setMenuColVisible(true)
    setMenuPosition({x: event.clientX, y: event.clientY})
    setIndex(idx)
  },[data,isMenuColVisible])

  //function to move col up
  const moveColUp = useCallback((idx) => {
    setMenuColVisible(false)
    if(idx-1 < 0){
      alert("cannot move up")
      return;
    }
    const item = data.items
    const prev = item[idx-1]  
    item[idx-1] = item[idx]
    item[idx] = prev
    for (let i = 0; i < data.items.length; i++) {
      data.items[i]["sr no."]= i+1
    }
    setData({...data,items:item})
  },[data,isMenuColVisible])

  //function to move col down
  const moveColDown = useCallback((idx) => {
    setMenuColVisible(false)
    if(idx == data.items.length-1){
      alert("cannot move down")
      return;
    }
    const item = data.items
    const prev = item[idx+1]
    item[idx+1] = item[idx]
    item[idx] = prev
    for (let i = 0; i < data.items.length; i++) {
      data.items[i]["sr no."]= i+1
    }
    setData({...data,items:item})
  },[data,isMenuColVisible])

  //function to delete the col
  const deleteCol = useCallback(() => {
    setMenuColVisible(false)
    if(data.items.length == 1){
      alert("cannot be delete")
      return
    }
    data.items.splice(index,1)
    for (let i = 0; i < data.items.length; i++) {
      data.items[i]["sr no."]= i+1
    }
    console.log(data)
    setData({...data})
  },[data,isMenuColVisible])



useEffect(() => {
  if (data){
    const textarea = document.querySelectorAll('.table-textarea');
    textarea.forEach(textarea => {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }
},[data]);
  // Render the table
  return (
    tableData != null &&(
      <>
      <DeleteRowMenu 
        isMenuVisible={isMenuVisible} 
        menuPosition={menuPosition} 
        setMenuVisible={setMenuVisible}
        index={index}
        shiftRowLeft = {shiftRowLeft}
        shiftRowRight={shiftRowRight}
        deleteRow={deleteRow}
      />
      <ColumnMenu 
        isMenuVisible={isMenuColVisible} 
        menuPosition={menuPosition} 
        setMenuVisible={setMenuColVisible} 
        index={index}
        moveColUp={moveColUp}
        moveColDown={moveColDown}
        deleteCol={deleteCol}
        
      />
      <div className='edit-table-but'>
        <button type='button' onClick={addColumn}>add column</button>
        <button type='button' onClick={addRow}>add row</button>
      </div>
    <div className='table'>
      
      <table border="1" cellPadding="10">
        <thead>
          <tr >
            {
              data ? data?.headers?.map((header,idx) => 
                <th 
                style={{maxWidth:`${setWidth(idx)}` }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    openRowMenu(idx)
                  }}
                  key={idx}
                >
                  <input type="text" value={data.headers[idx]} onChange={(e) => changeHeader(idx, e.target.value)} />
                </th>
              ) : null    
            }
          </tr>
        </thead>
        <tbody>
          {
            data ?
            data?.items?.map((item, rowIndex) => (
              <tr 
                onContextMenu={(e) => {
                  e.preventDefault();
                  openColMenu(rowIndex)
                }}
              key={rowIndex}>
                {
                  data?.headers?.map((header, colIndex) => (
                    <td key={colIndex}
                      style={{maxWidth:`${setWidth(colIndex)}` }}
                    >
                      
                      <textarea
                      className='table-textarea'
                        type="text"
                        value={item[header] || ''}
                        // onChange={(e) => handleCellEdit( e.target.value)}
                        onChange={(e) => handleCellEdit(rowIndex, header, e.target.value)}
                      />
                    </td>
                  ))
                }
              </tr>
            ))
            : null
          }
        </tbody>
      </table>
    </div>
      <div className='table-submit-but'>
        <button type="submit" className={`submit-button `}>
              submit
        </button>
      </div>
    </>
    )
  );
};

export default EditableTable;
