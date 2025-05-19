import { set } from "mongoose";
import { useEffect, useState } from "react";

function Profile() {
    const [profilepic, setPic] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [image,setImage]=useState(null)
    const [user,setUser]=useState('')
    const [pic,setprofilePic]=useState('')
    const [mail,setMail]=useState('')
    const [flag,setFlag]=useState(false)
    useEffect(() => {
        async function getdetails() {
            const response = await fetch('http://localhost:30002/get-tokens', {
                method: "POST",
                headers: { 'Content-type': 'application/json' },
                credentials: "include"
            });
            if (response.ok) {
                const i = `http://localhost:30002/${localStorage.getItem('userprofile')}`
                const username = localStorage.getItem('username')
                setUserName(username)
                setprofilePic(i)
                setUser(username)
                setPic(i)
                const data = await response.json()
                setEmail(data.email)
                setMail(data.email)
            }
        }
        getdetails()
    },[])
    const handlebutton = () => {
        document.getElementById('formelement').className = 'visible ml-20 text-center flex flex-col gap-x-1 gap-y-2 items-center '
        document.getElementById('pr').className = 'collapse'

    }
    const handleuserName = (e) => {
        setUser(e.target.value)
    }
    const handleEmail = (e) => {
        setMail(e.target.value)
    }
    const handleFile=(e)=>{
        setFlag(true)
         const file = e.target.files[0];
  setImage(file)
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      console.log(e.target.result)
      setprofilePic(e.target.result)
    };
    reader.readAsDataURL(file);
  }
        
    }
    const handleX=()=>{
        document.getElementById('pr').className = 'visible ml-20 text-center flex flex-col gap-x-1 gap-y-2 items-center '
        document.getElementById('formelement').className = 'collapse'
    }
    const handleSubmit=(e)=>{
        e.preventDefault()
        async function submit(){
            if(flag==false){
                await fetch(profilepic)
    .then(response => response.blob())
    .then(blob => {
      const defaultFile = new File([blob], "default.jpg", { type: blob.type });
      setImage(defaultFile);
    })
    .catch(error => console.error('Error fetching default image:', error));
            }
            const formdata=new FormData()
            formdata.append('newname',user)
            formdata.append('newemail',mail)
            formdata.append('image',image)
            console.log(image)
            setFlag(false)
         await fetch('http://localhost:30002/profilechange',{
                method:'POST',
                credentials:'include',
                body:formdata
            }).then((response)=>response.json())
            .then((data)=>{
                console.log(data.userprofile)
                setEmail(data.email)
                setMail(data.email)

                setUserName(data.username)
                setUser(data.username)
                var i2=`http://localhost:30002/${data.userprofile}`
                setPic(i2)
                localStorage.setItem('username',data.username)
                localStorage.setItem('userprofile',data.userprofile)
                setprofilePic(i2)
                console.log(data.msg)
                document.getElementById('pr').className = 'visible ml-20 text-center flex flex-col gap-x-1 gap-y-2 items-center '
        document.getElementById('formelement').className = 'collapse'
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        submit()
    }
    return (<>
        <div className="ml-130 mt-5 text-center flex flex-col gap-y-8 items-center shadow-xl w-90 h-102 mb-20 ">
            <div id="pr"><button className="border-none bg-white hover:none"><img
                src={profilepic} crossOrigin="anonymous"></img></button>
                <div className="hover:transform">{userName}</div>
                <div>{email}</div>
                <button type='button'className="mr-0 bg-white" id="buttonclick" onClick={() => handlebutton()}>
                    Change your profile</button></div>
            <form className="collapse pr-30" id="formelement">
                <div className="flex justify-start ml-30">
                <button className="py-2 px-4 mx-10 bg-white mb-1 pt-0"onClick={()=>handleX()}>X</button></div>
                <img
                    src={pic} className="rounded-full h-20" crossOrigin="anonymous"></img>
                <input type="file"name='image'accept="'image/*"onChange={handleFile}></input>
                <label for='username'>Username</label>
                <input type="text" id='username' className="border-1"
                    value={user} onChange={handleuserName}></input>
                <label for='email'>Email</label>
                <input type="email" id='email' className="border-1"
                    value={mail} onChange={handleEmail}></input>
                    <button type='button'onClick={(e)=>handleSubmit(e)}>Save changes</button>
            </form>
        </div></>
    )
}
export default Profile