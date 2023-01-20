import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgClose } from "react-icons/cg";

const MainNavigation = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openMobile, setOpenMobile] = useState(true);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className={classes.header}>
      <div className={classes.mobile__section}>
        <div className={classes.logo}>
          <Link to="/">THE COOK MASTER</Link>
        </div>
        <div>
          {openMobile ? (
            <button
              className={classes.mobile__btn}
              onClick={() => setOpenMobile(false)}
            >
              <GiHamburgerMenu />
            </button>
          ) : (
            <button
              className={classes.mobile__btn}
              onClick={() => setOpenMobile(true)}
            >
              <CgClose />
            </button>
          )}
        </div>
      </div>

      <nav>
        <ul
          className={`${classes.lis} ${openMobile ? classes.display : null} `}
        >
          <li>
            <Link to="/">РЕЦЕПТИ</Link>
          </li>
          {user && (
            <li>
              <Link to="/dobavi">ДОБАВИ РЕЦЕПТА</Link>
            </li>
          )}
          {/* <li>
            <Link to="/recepti">РЕЦЕПТИ</Link>
          </li> */}
          {!user && (
            <li>
              <Link to="/login">ВЛЕЗ</Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/register">РЕГИСТРАЦИЯ</Link>
            </li>
          )}
          {user && (
            <li>
              <Link to="/" onClick={onLogout}>
                ИЗХОД
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Link to="/profil">Профил</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
