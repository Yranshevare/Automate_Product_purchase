import React, { useCallback, useEffect, useRef } from 'react';

function DeleteRowMenu({isMenuVisible,menuPosition,setMenuVisible,index,shiftRowLeft,shiftRowRight,deleteRow}) {

  const menuRef = useRef(null);

  

  const handleClickOutside =useCallback( (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  },[]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    isMenuVisible && (
        <div
        className='table-menu-container'
          ref={menuRef}
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <ul 
          className='table-menu-but'
          style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li onClick={() => deleteRow(index)}>delete this column</li>
            <hr />
            <li onClick={() => shiftRowLeft(index)}>move left</li>
            <hr />
            <li onClick={() => shiftRowRight(index)}>move right</li>
          </ul>
        </div>
      )
  );
}

export default DeleteRowMenu;
