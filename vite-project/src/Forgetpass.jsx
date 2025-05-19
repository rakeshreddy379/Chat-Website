import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Forgetpass(){
    const [message,setMessage]=useState('')
    const [otp,setOtp]=useState(0)
    const [username,setMail]=useState('')
    const [password,changePassword]=useState('')
    const navigate=useNavigate()
   useEffect(()=>{
   document.getElementById('change').style.display='none'
   },[])
   const setEmail=(e)=>{
    setMail(e.target.value)
   }
   const handlePassword=(e)=>{
    changePassword(e.target.value)
   }
   const submitPassword=()=>{
    async function submittingPassword(){
const response=await fetch('http://localhost:30002/changepassword',{
    method:'POST',
    headers:{
         "Content-Type": 'application/json'
    }, credentials:'include',
    body:JSON.stringify({password:password})
})
var data;
if(response.ok){
    data=await response.json()
localStorage.setItem('username',data.username)
localStorage.setItem('userprofile',data.userprofile)
navigate('/home')
}
else{
    console.log(data.msg)
}s
    }
    submittingPassword()
   }
   const submitEmail=()=>{
async function forgetpass(){
    const response = await fetch('http://localhost:30002/forgetpass', {
        method: "POST",
        headers: {
            "Content-Type":'application/json'
        },
       
        body:JSON.stringify({username:username}),
    });
    if(response.ok){
     setMessage("OTP has been sent to your registered email account ,please verify it..")
     document.getElementById('send').disabled=true
         document.getElementById('username').disabled=true
    }
    else{
    const data=await response.json()
    setMessage(data.msg)
    }
   }
forgetpass()
   }
   const handleOtp=(e)=>{
    setOtp(e.target.value)
   }
   
   const submitOtp=()=>{
async function otpverify() {
const response = await fetch('http://localhost:30002/otpverify', {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        credentials:'include',
        body:JSON.stringify({otp:otp,username:username}),
    });
    if(response.ok){
        console.log(response)
        document.getElementById('otp').style.display='none'
        document.getElementById('change').style.display='block'
    }
    else{
console.log(response)
    }
}
otpverify() 
 }
    return(<>
    <div id='otp'>
        <p>{message}</p>
        <input type="text"name='username'id='username'
        placeholder="enter your username"onChange={setEmail}></input>
        <button onClick={()=>submitEmail()}id='send'>Send</button>
    <input type='number'name='otp'id='otp'placeholder="enter otp number"
    onChange={handleOtp}></input>
    <button onClick={()=>submitOtp()}>Submit</button>
    </div>
    <div id='change'>
        <p>Modify your password</p>
        <input type='password'name='password'id='pass'onChange={handlePassword}
        placeholder='enter new password'></input>
        <button onClick={()=>submitPassword()}>Change</button>
    </div>
    </>)
}
export default Forgetpass