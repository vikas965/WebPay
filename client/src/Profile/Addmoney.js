import React from 'react'
import './Profile.css'
import imageboy from '../assets/addmoney.png'
const Addmoney = () => {
  return (
    <div className='addmoney-container'>
        <div className="image-boy">
<img src={imageboy} alt="" />
        </div>

        <div className="addmoney-box">

            <center><h2>ADD MONEY</h2></center>

            <div className="bankdetails">

                <input type="number" placeholder='Enter Amount' />
                {/* <input type="number" placeholder='Enter Amount' /> */}
            </div>
            
        </div>

      
    </div>
  )
}

export default Addmoney
