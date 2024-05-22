// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link component
import './Navbar.css';
import logo from '../../img/Logo-Instagram.webp';
import { LoginContext } from '../../context/LoginContext';


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
    }

    return (
        <div className='Navbar flex justify-around items-center '>
            <img src={logo} alt="" className='object-contain' onClick={() => { Navigate("/") }} />
            <ul className="menubar flex gap-2 items-center">
                {loginStatus()}
            </ul>
        </div>
    );
}

export default Navbar;
