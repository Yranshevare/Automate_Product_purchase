import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { server } from '../../constant';

export default function Title({IsTitleOpen,loadInfo}) {
    const [title, setTitle] = useState('')
    const [create, setCreate] = useState('create')

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.title-container')) {
                IsTitleOpen(false);
            }
        };

        document.querySelector('.title')?.addEventListener('click', handleClickOutside);

        return () => {
            document.querySelector('.title')?.removeEventListener('click', handleClickOutside);
        };
    }, [IsTitleOpen]);

    async function createProcess() {
        if(title === ''){
            alert('Please enter a title')
            return
        }
        try {
            setCreate('creating...')
            const res = await axios.post(`${server}process/create`,{title:title},{withCredentials: true})
            IsTitleOpen(false)
            alert(res.data.message) 
            loadInfo()             
        } catch (error) {
            console.log(error)
        }
        finally{
            setCreate('create')
        }
    }
  return (
    <div className='title-open title'>
        <div className='title-container'>
            <div className='inner-title-container'>
                <h4>Title of your process</h4>
                <input 
                onChange={(e)=>setTitle(e.target.value)}
                type="text" 
                placeholder='title'/>

                <div className='title-button-container'>
                    <button
                    onClick={createProcess}
                    >{create}</button>
                    <button 
                    onClick={()=>IsTitleOpen(false)}>cancel</button>
                </div>
            </div>
        </div>
      
    </div>
  )
}
