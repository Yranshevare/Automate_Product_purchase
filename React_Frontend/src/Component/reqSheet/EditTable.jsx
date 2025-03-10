import React, { useEffect, useState } from 'react';
import DeleteRowMenu from './DeleteRowMenu';
import ColumnMenu from './ColumnMenu';

function EditableTable({tableData}) {
  
  const initialState = {
    headers:["mention your headers"],
    items:[{"mention your headers":'description'}]
  }


  const [data, setData] = useState();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isMenuColVisible, setMenuColVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [index , setIndex] = useState(null)


  useEffect(() => {
      setData(tableData ||initialState)
  },[tableData])
  useEffect(() => {
      console.log(data,"data")
  },[data])


  const handleCellEdit = (rowIndex, colKey, value) => {
    const updatedData = [...data.items];
    updatedData[rowIndex][colKey] = value;
    setData({...data, items: updatedData});
  };

  const changeHeader = (idx , value) => {
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
  }

  const addColumn = () => {
    const updatedData = [...data.headers];
    updatedData.push("");
    setData({...data, headers: updatedData});
  }

  const addRow = () => {
    const emptyObj = {}
    const updatedData = [...data.items];
    data.headers.map(header => emptyObj[header] = '')
    updatedData.push(emptyObj);
    setData({...data, items: updatedData});
  }


  // function to open the row menu on right click
  const openRowMenu = (idx) => {
    console.log("row")
    if(isMenuColVisible){
      setMenuColVisible(false)
    }
    setMenuVisible(true)
    setMenuPosition({x: event.clientX, y: event.clientY})
    setIndex(idx)
  }


  //function to shift row at left side
  const shiftRowLeft = (idx) => {
    setMenuVisible(false)
    if(idx-1 < 0){
      alert("cannot shift left")
      return;
    }
    console.log("moved to left")
    const head = [...data.headers];
    const curr = head[idx]
    head[idx] = head[idx-1]
    head[idx-1] = curr
    setData({...data,headers:head})
  }

  //function to move the row at right side
  const shiftRowRight = (idx) => {
    setMenuVisible(false)
    if(idx == data.headers.length-1){
      alert("cannot shift right")
      return;
    }
    console.log("moved to right")
    const head = [...data.headers];
    const curr = head[idx]
    head[idx] = head[idx+1]
    head[idx+1] = curr
    setData({...data,headers:head})
  }

  //function to delete the row
  const deleteRow = () => {
    setMenuVisible(false)
    if(data.headers.length == 1){
      alert("cannot be delete")
      return
    }
    const head = [...data.headers];
    data.items.map(item => delete item[head[index]])
    head.splice(index,1)
    setData({...data,headers:head})
  }

  //function to open columns menu on right click
  const openColMenu = (idx) => {
    console.log("col")
    if(isMenuVisible){
      setMenuVisible(false)
    }
    setMenuColVisible(true)
    setMenuPosition({x: event.clientX, y: event.clientY})
    setIndex(idx)
  }

  //function to move col up
  const moveColUp = (idx) => {
    setMenuColVisible(false)
    if(idx-1 < 0){
      alert("cannot move up")
      return;
    }
    const item = data.items
    const prev = item[idx-1]
    item[idx-1] = item[idx]
    item[idx] = prev
    setData({...data,items:item})
  }

  //function to move col down
  const moveColDown = (idx) => {
    setMenuColVisible(false)
    if(idx == data.items.length-1){
      alert("cannot move down")
      return;
    }
    const item = data.items
    const prev = item[idx+1]
    item[idx+1] = item[idx]
    item[idx] = prev
    setData({...data,items:item})
  }

  //function to delete the col
  const deleteCol = () => {
    setMenuColVisible(false)
    if(data.items.length == 1){
      alert("cannot be delete")
      return
    }
    data.items.splice(index,1)
    console.log(data)
    setData({...data})
  }



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
          <tr>
            {
              data ? data?.headers?.map((header,idx) => 
                <th 
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
                    <td key={colIndex}>
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
    </>
    )
  );
};

export default EditableTable;
