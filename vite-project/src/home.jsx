import { useEffect } from "react"
import { useNavigate,createBrowserRouter,RouterProvider,Navigate, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import socket from "./Connection";
// import Chat from './Chat.jsx'
import Cookies from 'js-cookie'
function home(){
    const navigate=useNavigate()
    const location = useLocation();
    const  username =localStorage.getItem('username') || '';
    const userprofile=localStorage.getItem('userprofile')||''
    const image=new URL(`http://localhost:30002/${userprofile}`)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:30002/get-tokens',{
                method:"POST",
                headers:{'Content-type':'application/json'}, 
                credentials:"include"
            });
            if (!response.ok) {
              navigate('/login')
            }
            const result = await response.json();
            setData(result);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
        if(!socket.connected){
          socket.connect()
        }
      },[]); 
    return(
        <><div className=" 
        flex justify-evenly items-end">
            <Link to='/home/addfriends'>Connect to the world</Link><br></br>
            <Link  to='/home/chat'>Chat</Link>
            <Link to='/home/profile'><img src={image}crossOrigin="anonymous"className="rounded-full h-20"></img></Link>
           
            {/* <Link to='/chat'>Chat</Link> */}
            </div></>
    )
}
export default home
