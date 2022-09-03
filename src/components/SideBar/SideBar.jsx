import React, { useState, useEffect, useCallback, memo } from "react";
import Style from "./SideBar.module.scss";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { db, FirebaseTimestamp } from "../../firebase";
import { useAuthContext } from "../../pages/AuthContext";
import TextBox from "../TextBox/TextBox";
import { friendRequest } from "../../apis";
import Logo from "../../asset/logo.png";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = memo((props) => {
  const { user } = useAuthContext();
  const uid = user.uid;
  const [isOpenFriendList, setIsOpenFriendList] = useState(false);
  const [friends, setFriends] = useState("");
  useEffect(() => {
    if (user !== "") {
      db.collection("user")
        .doc(uid)
        .collection("friend")
        .get()
        .then((query) => {
          const friend = [];
          query.forEach((doc) => {
            const data = doc.data();
            friend.push({
              friendId: doc.id,
              name: data.name,
              images: data.images,
              lat: data.lat,
            });
          });
          setFriends(friend);
        })
        .catch((error) => {
          console.log(`データの取得に失敗しました (${error})`);
        });
    }
  }, [user, uid]);

  const [request, setRequest] = useState("");
  useEffect(() => {
    if (user !== "") {
      db.collection("user")
        .doc(uid)
        .collection("request")
        .get()
        .then((query) => {
          const friend = [];
          query.forEach((doc) => {
            const data = doc.data();
            friend.push({
              friendId: doc.id,
              name: data.requestFriendName,
              date: data.requestDate,
              images: data.requestImages,
            });
          });
          setRequest(friend);
        })
        .catch((error) => {
          console.log(`データの取得に失敗しました (${error})`);
        });
    }
  }, [user, uid]);

  const friendToggleBtn = () => {
    if (isOpenFriendList === false) {
      setIsOpenFriendList(true);
    } else {
      setIsOpenFriendList(false);
    }
  };

  const timestamp = FirebaseTimestamp.now();
  const dateToString = (date) => {
    return (
      date.getFullYear() +
      "年" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "月" +
      ("00" + date.getDate()).slice(-2) +
      "日" +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2)
    );
  };
  const date = dateToString(timestamp.toDate());

  const [friendId, setFriendId] = useState("");
  const inputFriendId = useCallback(
    (event) => {
      setFriendId(event.target.value);
    },
    [setFriendId]
  );
  const [showFindFriend, setShowFindFriend] = useState(false);
  const [surveillance, setSurveillance] = useState(false);

  useEffect(() => {
    if (friendId !== "" && showFindFriend === true && surveillance === true) {
      db.collection("user")
        .doc(friendId)
        .collection("request")
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.id === uid) {
              setFriendId("");
              setShowFindFriend(false);
              alert("リクエストを送信しました。");
            }
          });
        });
    }
  }, [showFindFriend, friendId, uid, surveillance]);

  const { requestFriend, findFriendName } = props;

  const [myName, setMyName] = useState(""),
    [myImages, setMyImages] = useState("");
  useEffect(() => {
    if (user !== "") {
      db.collection("user")
        .doc(uid)
        .get()
        .then((doc) => {
          const data = doc.data();
          setMyName(data.name);
          setMyImages(data.images);
        })
        .catch((error) => {
          console.log(`データを取得できませんでした (${error})`);
        });
    }
  }, [user, uid]);

  const choiceFriendLocation = (friendId) => {
    db.collection("user")
      .doc(friendId)
      .get()
      .then((doc) => {
        const data = doc.data();
        if (data.lat) {
          props.onClick(friendId);
        } else {
          alert("位置情報がありません。");
        }
      })
      .catch((error) => {
        console.log(`データを取得できませんでした (${error})`);
      });
  };

  console.log(request);

  return (
    <div className={Style.sidebarBx}>
      <div className={Style.ovf}>
        <div className={Style.sidebarLeft}>
          <div className={Style.logo}>
            <img src={Logo} alt="logo" />
          </div>
          <div className={Style.linkPeople}>
            <div onClick={friendToggleBtn}>
              <span>
                <PeopleAltIcon />
              </span>
              <p>友だち</p>
            </div>
            <div onClick={props.showProfile}>
              <span>
                <AccountCircleIcon />
              </span>
              <p>プロフィール</p>
            </div>
            <div onClick={props.myLocation}>
              <span>
                <LocationOnIcon />
              </span>
              <p>自分の位置</p>
            </div>
          </div>
          <div className={Style.getLocation}>
            <span onClick={props.signOut}>
              <LogoutIcon />
            </span>
          </div>
        </div>
        {isOpenFriendList && (
          <div className={Style.sidebarRight}>
            <ul>
              <li className={Style.friendSearch}>
                <TextBox
                  className={"inputFriend"}
                  label={"IDで友だち検索"}
                  type={"text"}
                  InputLabelProps={{ shrink: true }}
                  variant={"standard"}
                  value={friendId}
                  onChange={inputFriendId}
                />
                <span
                  className={Style.sendIconBx}
                  onClick={() => {
                    props.showSearchFriend(friendId);
                    setShowFindFriend(true);
                  }}
                >
                  <SearchIcon />
                </span>
              </li>
              {showFindFriend && (
                <li className={Style.findFriend}>
                  <h2>{findFriendName}</h2>
                  <div
                    onClick={() => {
                      friendRequest(friendId, date, uid, myName, myImages);
                      setSurveillance(true);
                    }}
                  >
                    <span>
                      <SendIcon />
                    </span>
                    リクエスト
                  </div>
                </li>
              )}
              {request.length > 0 && (
                <li className={Style.friendLstTtl}>リクエスト</li>
              )}
              {request.length > 0 &&
                request.map((list) => (
                  <li
                    key={list.friendId}
                    className={Style.friendList}
                    onClick={() => requestFriend(list.friendId)}
                  >
                    <Stack direction="row" spacing={2}>
                      {list.images ? (
                        <Avatar
                          alt="リクエスト"
                          src={list.images.path}
                          className={Style.avatar}
                        />
                      ) : (
                        <Avatar
                          alt="photo"
                          src="/static/images/avatar/1.jpg"
                          className={Style.avatar}
                        />
                      )}
                    </Stack>
                    <p>{list.name}</p>
                  </li>
                ))}
              <li className={Style.friendLstTtl}>友だち</li>
              {friends.length > 0 &&
                friends.map((list) => (
                  <li key={list.friendId} className={Style.friendList}>
                    <span
                      className={Style.friendInfo}
                      onClick={() => choiceFriendLocation(list.friendId)}
                    >
                      <Stack direction="row" spacing={2}>
                        {list.images ? (
                          <Avatar
                            alt={list.images.id}
                            src={list.images.path}
                            className={Style.avatar}
                          />
                        ) : (
                          <Avatar
                            alt="photo"
                            src="/static/images/avatar/1.jpg"
                            className={Style.avatar}
                          />
                        )}
                      </Stack>
                      <p>{list.name}</p>
                    </span>
                    <span
                      className={Style.menu}
                      onClick={() => props.setChoiceFriendId(list.friendId)}
                    >
                      <ChatIcon />
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

export default SideBar;
