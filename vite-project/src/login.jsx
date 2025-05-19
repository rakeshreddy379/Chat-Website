import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {createBrowserRouter,RouterProvider,Navigate, Link } from "react-router-dom";
function login(){
const [formData,setFormData]=useState({username:'',email:'',password:''})
const navigate=useNavigate()
function handleChange(e){
    // console.log(e)
    setFormData({...formData,[e.target.name]:e.target.value})
}

const handleSubmit=async(e)=>{
e.preventDefault()
try{
    const response=await fetch('http://localhost:30002/login',{
        method:"POST",
        headers:{'Content-type':'application/json'},
        body:JSON.stringify(formData),
        credentials:"include"
    })
    if(response.ok){
      console.log(response)
      const data=await response.json()
      console.log(data)
      localStorage.setItem('username',data.username)
      localStorage.setItem('userprofile',data.userprofile)
      console.log('came')
        navigate('/home')
    }
    else{
        const data=await response.json()
        console.log(data)
        alert(data.message)
    }
    

}
catch (error){
console.log(error)
}
}
    return(
       <> <form onSubmit={handleSubmit}>
              <div class="mb-3">
    <label for="username" class="form-label"> Username</label>
    <input type="text" name='username'onChange={handleChange}class="form-control" id="username" aria-describedby="username"required></input>
    <div id="username" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" name='password'onChange={handleChange}class="form-control" id="exampleInputPassword1"required></input>
  </div>
  
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
<Link to='/login/forgetpass'>Forget Password</Link><br></br>
</>
    )
}
export default login