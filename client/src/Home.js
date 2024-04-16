import React from 'react'
import homegif from "./assets/home.gif"
import { useNavigate } from 'react-router-dom'
// import { useEffect } from 'react'
const Home = () => {
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem('token');

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         navigate('/login');
    //     }
    // }, [isLoggedIn, navigate]);


    const navigateto = () => {
        navigate('/login')
    }

    const explore = () =>{
        navigate('/home')
    }
    return (
        <div>
            <div className="topcontent">
                <div className="content">
                    <h1>WebPay</h1>
                    <p>A secure Payment way ....</p>
                    {
                        !isLoggedIn ? <button className='btn' onClick={navigateto}>Login</button>: <button className='btn' onClick={explore} >Explore</button>
                    }
                   
                </div>
                <img src={homegif} alt="" />
            </div>

            <div className="footer"></div>
        </div>
    )
}

export default Home
