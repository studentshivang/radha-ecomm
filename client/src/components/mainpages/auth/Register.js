import axios from "axios";
import React,{useState} from "react";
import {Link} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Register (){
   
    const [user,setUser] = useState({
        name:"",email:"",password:""
    });

    const onChangeInput = e =>{
        const {name,value} = e.target;
        setUser({...user,[name]:value});
    }

    const registerSubmit=async (e) =>{
        e.preventDefault();
        try {
            await axios.post('/user/register',{...user});
            
            localStorage.setItem('firstLogin',true);
            window.location.href="/";
        } catch (err) {
            toast.error(err.response.data.msg);
        }
    }

    return(
        <>
        <ToastContainer/>   
        <div className="login-page">
        <h2>Register</h2>
            <form onSubmit={registerSubmit}>
                <input type="text" name="name" required 
                placeholder="Name" value={user.name} onChange={onChangeInput}/>

                <input type="email" name="email" required 
                placeholder="Email" value={user.email} onChange={onChangeInput}/>

                <input type="password" name="password" required autoComplete="on"
                placeholder="Password" value={user.password} onChange={onChangeInput}/>

                <div className="row">
                    <Link to="/login">Login</Link>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default Register