// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import SignUplogo from '../../img/Logo-Instagram.webp';
import './Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function SignUp() {
    const naviGate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");

    // Toast function
    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)

    const emailRegex = /^\w+(\.-]?\w+)*@\w+(\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/;
    const postData = () => {

        if (!emailRegex.test(email)) {
            notifyA("invalid email")
            return
        }
        else if (!passRegex.test(password)) {
            notifyA("A password must be eight characters including one uppercase letter, one special character and alphanumeric characters?")
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                userName: userName,
                email: email,
                password: password

            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    notifyA(data.error)
                }
                else {
                    notifyB(data.message)
                    naviGate("/login")
                }

                console.log(data)

            })
    }

    return (
        <div className='sign-up '>

            <div className="form-container">
                <div className="form bg-white border-2  p-8 sm:w-1/2 m-auto">
                    <div className='m-auto '>
                        <img src={SignUplogo} alt="" className='m-auto w-64' />
                    </div>
                    <p className='Login-pera'>
                        Sign up to see photos and video <br />from your friends
                    </p>
                    <button id="submit-btn" type="button" className="mt-4 mb-4 w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-3 py-2  dark:bg-blue-500 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-blue-500"><a href="https://www.facebook.com/"><FontAwesomeIcon icon={faFacebookSquare} className='pe-1' /> Login  with Facebook</a></button>
                    <div className='my-4'>
                        <hr />
                        <p className='w-fit px-8 bg-white mt-min-1 m-auto'>OR</p>
                    </div>
                    <div className='mb-1 m-y-[-0.8]'>
                        <input type="email" id="email" className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mobile number or email address" name='email' required value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className='mb-1'>
                        <input type="text" id="name" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Full Name" name='Name' value={name} onChange={(e) => { setName(e.target.value) }} />

                    </div>
                    <div className='mb-1'>
                        <input
                            type="text"
                            id="username"
                            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Username"
                            name="username"
                            value={userName}
                            onChange={(e) => { setuserName(e.target.value) }}
                            required
                        />

                    </div>
                    <div className='mb-4'>
                        <input type="text" id="password" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" name='password' required value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <div className='Login-last-pera'>
                        <p>
                            People who use our service may have uploaded your contact information to Instagram. <a href="https://www.facebook.com/help/instagram/261704639352628" className='text-blue-500'> Learn more</a>
                        </p>

                        <p className='pt-4'>
                            By signing up, you agree to our <a href="https://facebook.com/privacy/policy" className='text-blue-500'>Terms, Privacy Policy</a> and <a href="https://privacycenter.instagram.com/policies/cookies/" className='text-blue-500'>Cookies Policy.
                            </a>
                        </p>
                    </div>
                    <button id="submit-btn" type="button" className="mt-4 w-full text-white bg-blue-400 hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5  dark:bg-blue-400 dark:hover:bg-blue-400 focus:outline-none dark:focus:ring-blue-400" onClick={() => { postData() }}>Sign Up</button>
                </div>
                <div className="form2 border-2 p-4 w-1/2 m-auto mt-4 bg-white">
                    <p>Have an account? <Link to='/LogIn'><span className='text-blue-500'>Log in</span></Link></p>
                </div>
                <p className='py-4 text-white'>
                    Get the app.
                </p>
            </div>
        </div >
    );
}

export default SignUp;
