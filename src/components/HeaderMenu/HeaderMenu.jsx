import React, { memo } from "react";
import Style from "./HeaderMenu.module.scss";

const HeaderMenu = memo((props) => {
  const { showProfile, myLocation, menuBtn, friendBtn, classToggle, signOut } =
    props;

  return (
    <div className={Style.headerMenuBx}>
      <ul>
        <li onClick={friendBtn}>
          <span className={Style.menuLstInner} onClick={menuBtn}>
            <p>友だち</p>
          </span>
        </li>
        <li onClick={showProfile}>
          <span className={Style.menuLstInner} onClick={menuBtn}>
            <p>プロフィール</p>
          </span>
        </li>
        <li onClick={myLocation}>
          <span className={Style.menuLstInner} onClick={classToggle}>
            <p>自分の位置</p>
          </span>
        </li>
        <li onClick={signOut}>
          <span className={Style.menuLstInner}>
            <p>ログアウト</p>
          </span>
        </li>
      </ul>
    </div>
  );
});
export default HeaderMenu;
