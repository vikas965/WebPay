import "./App.css";
import { Route,Routes ,useLocation} from "react-router-dom";
import React from 'react'
import Home from "./Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./Dashboard";
import Footer from "./Footer/Footer";
import Password from "./Password";
import UserProfile from "./Profile/Profile";
import PaymentUsers from "./Payments/PaymentUsers";
import EditProfile from "./Profile/EditProfile";
import ChangePassword from "./ChangePassword";
import Payment from "./Payments/Payment";
import Transactions from "./Transactions/Transactions";
import TransactionSuccess from "./Transactions/TransactionSuccess";
import Addmoney from "./Profile/Addmoney";
const App = () => {


  const location = useLocation();

  // Define an array of paths where the footer should be hidden
  const hideFooterPaths = ["/","/login","/register"];

  // Check if the current path should hide the footer
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);
  
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/home" element={<Dashboard/>} />
        <Route path="/checkbalance" element={<Password/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/editprofile" element={<EditProfile/>} />
        <Route path="/pay" element={<PaymentUsers/>} />
        <Route path="/resetpass" element={<ChangePassword/>} />
        <Route path="/payment/:userId" element={<Payment />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/addmoney" element={< Addmoney />} />

        <Route path="/transactionsuccess/:transId" element={<TransactionSuccess />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
      <ToastContainer />
  
    </div>
  )
}

export default App

