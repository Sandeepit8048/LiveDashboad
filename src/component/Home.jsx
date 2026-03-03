import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Maindashboard from './Maindashboard';
function Home() {
    const[login, setlogin]=useState({
        first:'',
        last:'',
        email:'',
        password:''

    })

    const navigate = useNavigate();

  
  
    const handleSubmit=(e)=>{
      e.preventDefault();
      if(login.first==="Sandeep" && login.last === "Yadav" && login.email === "rkysandeepyadav@gmail.com" && login.password === "123" ){
           alert("Login Successful");
           navigate('/Maindashboard')
     
      }
      else{
        alert("Worng Name & Password")
      }
       

    }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
         <h2>Login-Page</h2>
        <label htmlFor="">First-Name</label>
        <input type="text" name="" id="" onChange={(e)=>{setlogin({...login, first:e.target.value })}} />
        <label htmlFor="">Last-Name</label>
        <input type="text" name="" id=""onChange={(e)=>{setlogin({...login, last:e.target.value })}} />
        <label htmlFor="">E-mail</label>
        <input type="email" name="" id="" onChange={(e)=>{setlogin({...login, email:e.target.value })}} />
        <label htmlFor="">Password</label>
        <input type="password" name="" id="" onChange={(e)=>{setlogin({...login, password:e.target.value })}} />
         <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default Home