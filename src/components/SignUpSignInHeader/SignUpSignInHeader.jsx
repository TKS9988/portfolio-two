import React from "react";
import Logo from "../../asset/logo.png";
import { Link } from "react-router-dom";
import Style from "./SignUpSignInHeader.module.scss";

const SignUpSignInHeader = () => {
  const url = window.location.pathname;
  return (
    <div className={Style.signupsigninHeader}>
      <div className={Style.left}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={Style.right}>
        {(() => {
          if (url === "/signin") {
            return (
              <Link className={Style.authBx} to="/signup">
                <p>アカウント登録</p>
              </Link>
            );
          } else {
            return (
              <Link className={Style.authBx} to="/signin">
                <p>アカウントをお持ちの方</p>
              </Link>
            );
          }
        })()}
      </div>
    </div>
  );
};
export default SignUpSignInHeader;
