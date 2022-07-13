import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import Menu from "./icon/menu.svg";
import Close from "./icon/close.svg";
import Cart from "./icon/cart-icon.svg";
import axios from "axios";
import { ToastContainer } from "react-toastify";


const Header = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu,setMenu] = useState(false)

  const logoutUser = async ()=>{
    await axios.post('/user/logout');
    localStorage.removeItem('firstLogin')
    window.location.href='/';
  }

  const adminRouter =()=>{
      return(
        <>
        <li><NavLink to="/create_product" >Create Product</NavLink></li>
        <li><NavLink to="/category" >Categories</NavLink></li>
        </>
      )
  }

  const loggedRouter =()=>{
      return(
        <>
        <li><NavLink to="/history" >History</NavLink></li>
        <li><NavLink to="/" onClick={logoutUser} >Logout</NavLink></li>
        </>
      )
  }

  const toggleMenu =()=>setMenu(!menu)

  const styleMenu ={
    left:menu?0:"-100%"
  }

  return (
    <header>
      <ToastContainer/>
      <div className="menu" onClick={()=>setMenu(!menu)}>
        <img src={Menu} alt="" width="30" />
      </div>

      <div className="logo">
        <h1>
          <NavLink to="/">{isAdmin?"Admin":"DevSD Shop"}</NavLink>
        </h1>
      </div>

      <ul style={styleMenu}>
        <li>
          <NavLink to="/">{isAdmin?"Products":"Shop"}</NavLink>
        </li>
        {isAdmin && adminRouter()}
        {
          isLogged ? loggedRouter():<li><NavLink to="/login">Login ❄ Register</NavLink></li>
        }
        <li onClick={()=>setMenu(!menu)}>
          <img src={Close} alt="" width="30" className="menu"/>
        </li>
      </ul>

      {
        isAdmin?''
        :<div className="cart-icon">
          <span>{cart.length}</span>
          <NavLink to="/cart">
            <img src={Cart} alt="" width="30" />
          </NavLink>
        </div>
      }

    </header>
  );
};

export default Header;
