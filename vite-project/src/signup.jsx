import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
function signup(){
const [formData,setFormData]=useState({username:'',email:'',password:''})
const [image,setImage]=useState("../public/jonsnow.jpg")
const [filename,setFile]=useState("")
useEffect(() => {
  // Fetch the default image and convert it to a Blob
  fetch(image)
    .then(response => response.blob())
    .then(blob => {
      const defaultFile = new File([blob], "default.jpg", { type: blob.type });
      setFile(defaultFile);
    })
    .catch(error => console.error('Error fetching default image:', error));
}, []);
function handleFileChange(event){
  const file = event.target.files[0];
  setFile(file)
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      console.log(e.target.result)
      setImage(e.target.result)
    };
    reader.readAsDataURL(file);
  }
}
function handleimageChange(){
document.getElementById('alert').style.display='block'
}
const navigate=useNavigate()
function handleChange(e){
    console.log(e)
    setFormData({...formData,[e.target.name]:e.target.value})
}
const handleSubmit=async(e)=>{
e.preventDefault()
const forms = new FormData();

  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      console.log(formData[key])
      forms.append(key, formData[key]);
      
    }
  }    forms.append('userprofile',filename)

  for (let [key, value] of forms.entries()) {
    console.log(`${key}: ${value}`);
  }
try{
    const response=await fetch('http://localhost:30002/signup',{
        method:"POST",
        body:(forms),
        credentials:"include"
    }) 
    if(response.ok){
      const data=await response.json()
      console.log(data)
      localStorage.setItem('username',data.username)
      localStorage.setItem('userprofile',data.userprofile)       
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
      <div class="container">
  <div class="alerting"id='alert'style={{display:'none'}}>
    <input type='file'onChange={handleFileChange}></input>
  </div>
        <form onSubmit={handleSubmit}>
        <div class="mb-3">
    <label for="userprofile" class="form-label">Email address</label>
    <img src={image} alt="Profile" name='userprofile'class="profile-image"onClick={handleimageChange}></img>    <div id="userprofile" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  
              <div class="mb-3">
    <label for="username" class="form-label">Email address</label>
    <input type="text" name='username'onChange={handleChange}class="form-control" id="username" aria-describedby="username"required></input>
    <div id="username" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" name='email'onChange={handleChange}class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"required></input>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" name='password'onChange={handleChange}class="form-control" id="exampleInputPassword1"required></input>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

</div>
    )
}
export default signup