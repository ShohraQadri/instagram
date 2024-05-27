// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link component
import './Navbar.css';
import logo from '../../assets/inta-icon.webp';
import { LoginContext } from '../../context/LoginContext';
import { IoMdHome, IoIosLogOut, IoIosAddCircle } from "react-icons/io";
import { MdAccountCircle, MdExplore } from "react-icons/md";

// eslint-disable-next-line react/prop-types
function Navbar({ login }) {
    const Navigate = useNavigate();
    const { setmodalOpen } = useContext(LoginContext)
    const loginStatus = () => {
        const token = localStorage.getItem("jwt")
        if (login || token) {
            return (
                <>
                    <li key="profile"><Link to="/profile">Profile</Link></li>
                    <li key="followingpost"><Link to="/followingpost">My Following</Link></li>
                    <li key="createpost"><Link to="/createpost">Createpost</Link></li>
                    <Link to={""}>
                        <button className='primaryBtn border-2 cursor-pointer font-bold' onClick={() =>
                            setmodalOpen(true)
                        }>
                            Log Out
                        </button>
                    </Link>
                </>
            );
        } else {
            return (
                <>
                    <li key="signup"><Link to="/signup">SignUp</Link></li>
                    <li key="login"><Link to="/login">SignIn</Link></li>
                </>
            );
        }
    };
    // eslint-disable-next-line no-unused-vars
    const loginStatusMobile = () => {
        const token = localStorage.getItem("jwt")
        if (login || token) {
            return (
                <>
                    <li key="profile"><Link to="/"><IoMdHome /></Link></li>
                    <li key="profile"><Link to="/profile"><MdAccountCircle /></Link></li>
                    <li key="followingpost"><Link to="/followingpost"><MdExplore /></Link></li>
                    <li key="createpost"><Link to="/createpost"><IoIosAddCircle /></Link></li>
                    <Link to={""}>
                        <link onClick={() =>
                            setmodalOpen(true)
                        }>
                            <IoIosLogOut />
                        </link>
                    </Link>
                </>
            );
        } else {
            return (
                <>
                    <li key="signup"><Link to="/signup">SignUp</Link></li>
                    <li key="login"><Link to="/login">SignIn</Link></li>
                </>
            );
        }

    }

    return (
        <div className='Navbar flex justify-around items-center '>
            <img src={logo} alt="" id="instalogo" className='object-contain' onClick={() => { Navigate("/") }} />
            <ul className="menubar flex gap-2 items-center">
                {loginStatus()}
            </ul>
            <ul className=" nav-mobile flex gap-2 items-center">
                {loginStatusMobile()}
            </ul>
        </div>
    );
}

export default Navbar;
