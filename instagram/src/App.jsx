import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useState } from 'react'
// import { createContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import SignUp from './components/SignUp/SignUp'
import LogIn from './components/LogIn/LogIn'
import Profile from './components/Profile/Profile'
import { CreatePost } from './components/createPost/CreatePost'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from './context/LoginContext'
import Modal from './components/Modal/Modal'
import UserProfile from './components/UserProfile/UserProfile'
import FollowingPost from './components/following/FollowingPost'

function App() {

  const [userLogin, setuserLogin] = useState(false)
  const [modalopen, setmodalOpen] = useState(false)

  return (

    <BrowserRouter>
      <div className='App'>
        <LoginContext.Provider value={{ setuserLogin, setmodalOpen }}>
          <Navbar login={userLogin} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='login' element={<LogIn />} />

            <Route exact path='profile' element={<Profile />} />
            <Route path='createPost' element={<CreatePost />} />
            <Route path="/profile/:userid" element={<UserProfile />} />
            <Route path='followingpost' element={<FollowingPost />} />
          </Routes>
          <ToastContainer theme='dark' />

          {modalopen && <Modal setmodalOpen={setmodalOpen} />}
        </LoginContext.Provider>

      </div>
    </BrowserRouter >


  )
}

export default App
