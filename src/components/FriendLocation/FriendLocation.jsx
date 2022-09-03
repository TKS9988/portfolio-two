import React, { memo } from "react";
import Style from "./FriendLocation.module.scss";
import Styles from "../Marker/Marker.module.scss";

const FriendLocation = memo((props) => {
  return (
    <>
      {(() => {
        if (
          props.nowTime - props.lastShareTime === 0 ||
          props.nowTime - props.lastShareTime < 10
        ) {
          return (
            <div
              key={props.index}
              lat={props.lat}
              lng={props.lng}
              name={props.uid}
            >
              <div onClick={props.onMarkerClick}>
                <div
                  className={`${Styles.pin} ${Styles.bounce}`}
                  style={{ backgroundColor: "#0099FF", cursor: "pointer" }}
                  title={props.name}
                />
                <div className={Style.pulse} />
              </div>
              {props.index === props.currentKey && (
                <ul className={Style.friendDetail}>
                  <li>氏名：{props.name}</li>
                  <li>
                    最終共有時間：{props.nowTime - props.lastShareTime + "分前"}
                  </li>
                </ul>
              )}
            </div>
          );
        } else if (props.nowTime - props.lastShareTime >= 10) {
          return (
            <div
              key={props.index}
              lat={props.lat}
              lng={props.lng}
              name={props.uid}
            >
              <div onClick={props.onMarkerClick}>
                <div
                  className={`${Styles.pin} ${Styles.bounce}`}
                  style={{
                    backgroundColor: "#444",
                    opacity: "0.7",
                    cursor: "pointer",
                  }}
                  title={props.name}
                />
                <div className={Style.pulse} />
              </div>
              {props.index === props.currentKey && (
                <div className={Style.friendDetailNonShare}>
                  <ul>
                    <li>氏名：{props.name}</li>
                    <li>
                      最終共有時間：
                      {String(props.lastShareTime).slice(0, 4) +
                        "年" +
                        String(props.lastShareTime).slice(4, 6) +
                        "月" +
                        String(props.lastShareTime).slice(6, 8) +
                        "日" +
                        String(props.lastShareTime).slice(8, 10) +
                        ":" +
                        String(props.lastShareTime).slice(10, 12)}
                    </li>
                  </ul>
                  <div
                    className={Style.messageBtn}
                    onClick={() => props.setChoiceFriendId(props.uid)}
                  >
                    メッセージ
                  </div>
                </div>
              )}
            </div>
          );
        } else {
          return <></>;
        }
      })()}
    </>
  );
});

export default FriendLocation;
