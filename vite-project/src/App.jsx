import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './login.jsx'
import Signup from './signup.jsx'
import Home from './home.jsx'
import Logout from './logout.jsx'
import Cookies from 'js-cookie'
import First from './first.jsx'
import {createBrowserRouter,RouterProvider,Navigate} from 'react-router-dom'
import Addfriend from './Addfriends.jsx'
import Forgetpass from './Forgetpass.jsx'
import Chat from './Chat.jsx'
import Profile from './Profile.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Chatting from './Chatting.jsx'
import {io} from 'socket.io-client'
function App() {
  const [count, setCount] = useState(0)
  const userToken=Cookies.get('usertoken')
  
  const router=createBrowserRouter([{
    path:'/home',

    element:<Home/>
  },{
  path:'/',

    element:<First/>
  },{
  path:'/home/profile',

    element:<><Profile/><Home/></>
  },{
    path:'/logout',

    element:<Logout/>
  },{path:'/home/addfriends',
  element:<><Addfriend/><Home/></>
},{
    path:'/signup',
    element:<Signup/>
  },{
    path:'/login',

    element:<Login/>
  },
{
  path:'/home/chat',
  element:<><Chat /><Home/></>
},
{
  path:'/home/chat/chatting',
  element:<><Chatting /><Home/></>
},{
  path:'/login/forgetpass',
  element:<><Forgetpass/></>
}])
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
