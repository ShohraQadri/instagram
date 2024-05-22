// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from 'react'
import Signin from '../../img/Logo-Instagram.webp'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import './Login.css'
import { toast } from 'react-toastify';
import { LoginContext } from '../../context/LoginContext';


function LogIn() {
    const { setuserLogin } = useContext(LoginContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const id = ""

    const naviGate = useNavigate()
    // Toast function
    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)
    const emailRegex = /^\w+(\.-]?\w+)*@\w+(\.-]?\w+)*(\.\w{2,3})+$/;

    // post data
    const postData = () => {

        if (!emailRegex.test(email)) {
            notifyA("invalid email")
            return
        }
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                id: id

            })
        }).then(res => res.json())
            .then(data => {
                console.log("login response data === ", data);
                if (data.error) {
                    notifyA(data.error)
                }
                else {
                    notifyB("Signed in Successfully!")
                    console.log(data)
                    localStorage.setItem("jwt", JSON.stringify(data))
                    setuserLogin(true)
                    naviGate("/")
                }

                console.log(data)

            })
    }

    return (
        <div className='Login flex justify-around m-auto'>
            <div className="form-container">
                <div className="form bg-white border-2  p-8 m-auto">
                    <div className='m-auto mb-8'>
                        <img src={Signin} alt="" className='m-auto w-80' />
                    </div>
                    <div className='mb-1 m-y-[-0.8]'>

                        <input type="email" id="email" className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mobile number or email address" name='email' required value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className='mb-4'>
                        <input type="text" id="password" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" name='password' required value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>

                    <button id="submit-btn" type="button" className=" w-full mb-4 text-white bg-blue-400 hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5  dark:bg-blue-400 dark:hover:bg-blue-400 focus:outline-none dark:focus:ring-blue-400" onClick={() => { postData() }}>Log in</button>
                    <div className='my-4'>
                        <hr />
                        <p className='w-fit px-6 bg-white mt-min-1 m-auto'>OR</p>
                    </div>
                    <div className="mt-2 mb-4 w-full  text-blue-900">
                        <a href="https://www.facebook.com/">
                            <FontAwesomeIcon icon={faFacebookSquare} className='pe-1' /> Login in with Facebook</a>
                    </div >
                    <div className=" mb-4 w-full f-13 text-blue-900">
                        <a href="">
                            Forgotten your password?</a>
                    </div >

                </div>
                <div className="form2 border-2 p-4   m-auto mt-4 bg-white">
                    <p> Do not have an account? <Link to='/SignUp'><span className='text-blue-500'>Sign Up</span></Link></p>
                </div>
                <p className='py-4'>
                    Get the app.
                </p>
            </div>
        </div >
    )
}

export default LogIn