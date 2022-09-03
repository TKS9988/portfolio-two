import React, { memo } from "react";
import Style from "./Header.module.scss";
import Logo from "../../asset/logo.png";

const Header = memo((props) => {
  return (
    <div className={Style.header}>
      <div className={Style.left}>
        <div className={Style.logo}>
          <img src={Logo} alt="logo" />
        </div>
      </div>
      <div
        onClick={props.classToggle}
        className={props.active ? `${Style.rightActive}` : `${Style.right}`}
      >
        <span></span>
        <span></span>
      </div>
    </div>
  );
});
export default Header;
