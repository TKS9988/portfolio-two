import React, { useState, useCallback } from "react";
import TextBox from "../components/TextBox/TextBox";
import { signUp } from "../apis";
import { Link } from "react-router-dom";
import { SignUpSignInHeader } from "../components";
import pcImage from "../asset/geolocationPcDisplay.png";
import spImage from "../asset/geolocationSpDisplay.png";
import Style from "./styles/SignUp.module.scss";
import LogoutIcon from "@mui/icons-material/Logout";

const SignUp = () => {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirmPassword, setConfirmPassword] = useState("");

  const inputName = useCallback(
    (event) => {
      setName(event.target.value);
    },
    [setName]
  );
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
  const inputConfirmPassword = useCallback(
    (event) => {
      setConfirmPassword(event.target.value);
    },
    [setConfirmPassword]
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
            <h2>Sign&nbsp;up</h2>
            <TextBox
              className={"inputBx"}
              label={"Full Name（フルネーム）"}
              type={"text"}
              InputLabelProps={{ shrink: true }}
              variant={"standard"}
              value={name}
              onChange={inputName}
            />
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
            <TextBox
              className={"inputBx"}
              label={"confirmPassword（確認用パスワード）"}
              type={"text"}
              InputLabelProps={{ shrink: true }}
              variant={"standard"}
              value={confirmPassword}
              onChange={inputConfirmPassword}
            />
            <div
              className={Style.editBtn}
              onClick={signUp(name, email, password, confirmPassword)}
            >
              決定
            </div>
            <div className={Style.toSignUpSignIn}>
              <Link className={Style.authBx} to="/signin">
                <span>
                  <LogoutIcon />
                </span>
                <p>アカウントをお持ちの方</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default SignUp;
