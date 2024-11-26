import { FaCode } from "react-icons/fa"
// import React, { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'

function LandingPage() {
    return (
        <>
            <div className="app">
                <FaCode style={{ fontSize: '4rem' }} /><br />
                <span style={{ fontSize: '2rem' }}>Let's Start Coding!</span>
            </div>
            <div style={{ textAlign: 'right' }}>Thanks For Using This Boiler Plate</div>
        </>
    )
}
/*
function LandingPage() {
    const navigate = useNavigate();
    
    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {                
                if (response.data.success) {                    

                    navigate('/login');
                }
                else {
                    alert('로그아웃 하는데 실패 했습니다.');
                }
            })
            .catch(error => console.error("Error:", error))            
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}
*/

export default LandingPage
