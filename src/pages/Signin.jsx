import React, { useState, useCallback } from "react";
import TextBox from "../components/TextBox/TextBox";
import { SignUpSignInHeader } from "../components";
import { signIn } from "../apis";
import { Link } from "react-router-dom";
import pcImage from "../asset/geolocationPcDisplay.png";
import spImage from "../asset/geolocationSpDisplay.png";
import Style from "./styles/SignUp.module.scss";
import LogoutIcon from "@mui/icons-material/Logout";

const Signin = () => {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState("");
  const inputEmail = useCallback(
    (event) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );
  const inputPassword = useCallback(
    (event) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );

  return (
    <>
      <SignUpSignInHeader />
      <section className={Style.ovf}>
        <div className={Style.left}>
          <div className={Style.displayBx}>
            <div className={Style.pcDisplay}>
              <div className={Style.inner}>
                <img src={pcImage} alt="pc" />
              </div>
            </div>
            <div className={Style.spDisplay}>
              <div className={Style.inner}>
                <img src={spImage} alt="sp" />
              </div>
            </div>
          </div>
        </div>
        <div className={Style.right}>
          <div className={Style.sinupBx}>
            <h2>Sign&nbsp;in</h2>
            <TextBox
              className={"inputBx"}
              label={"Email（メールアドレス）"}
              type={"email"}
              InputLabelProps={{ shrink: true }}
              variant={"standard"}
              value={email}
              onChange={inputEmail}
            />
            <TextBox
              className={"inputBx"}
              label={"Password（パスワード）"}
              type={"text"}
              InputLabelProps={{ shrink: true }}
              variant={"standard"}
              value={password}
              onChange={inputPassword}
            />
            <div className={Style.editBtn} onClick={signIn(email, password)}>
              決定
            </div>
            <div className={Style.toSignUpSignIn}>
              <Link className={Style.authBx} to="/signup">
                <span>
                  <LogoutIcon />
                </span>
                <p>アカウント登録はこちら</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
