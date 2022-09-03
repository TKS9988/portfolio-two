/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import {
  Marker,
  SideBar,
  AdminDetail,
  FriendLocation,
  Message,
  Profile,
  Request,
  Header,
  HeaderMenu,
  FriendList,
} from "../components";
import { useAuthContext } from "./AuthContext";
import mapColorRight from "../mapcolor/mapColorRight.json";
import normal from "../mapcolor/normal.json";
import mapColorDark from "../mapcolor/mapColorDark.json";
import { auth, db, FirebaseTimestamp } from "../firebase";
import Style from "./styles/Dashboard.module.scss";

const Dashboard = () => {
  const { user } = useAuthContext();
  console.log(user);

  // geoLocation
  const [mapSettingState, setMapSettingState] = useState({
    mapColor: mapColorRight,
    defaultZoom: 16,
  });
  const defaultProps = { zoom: mapSettingState.defaultZoom };
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [choiceFriendLat, setChoiceFriendLat] = useState("");
  const [choiceFriendLng, setChoiceFriendLng] = useState("");
  const [lastTimeLat, setLastTimeLat] = useState(null);
  const [lastTimeLng, setLastTimeLng] = useState(null);
  const [centerPosition, setCenterPosition] = useState("");

  const [booleanState, setBooleanState] = useState({
    share: false,
    surveillanceLocation: false,
    adminPosition: true,
    choiceFriendPosition: false,
    detailAccount: false,
    active: false,
    openProfile: false,
    showFriend: false,
    choiceMapMode: false,
    openSearchFriend: false,
    openRequestFriend: false,
    showMenu: false,
    showGoogleMap: false,
  });
  const [state, setState] = useState({
    userData: "",
    messages: "",
    friendsId: "",
    currentKey: -1,
    findFriendName: "",
    findFriendImages: "",
    requestFriendId: "",
  });

  // to component
  const [openMessage, setOpenMessage] = useState("");
  const [friendsLocation, setFriendsLocation] = useState("");
  const [choiceFriendId, setChoiceFriendId] = useState("");

  const timestamp = FirebaseTimestamp.now();
  const timeToString = (date) => {
    return (
      date.getFullYear() +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      ("00" + date.getDate()).slice(-2) +
      ("00" + date.getHours()).slice(-2) +
      ("00" + date.getMinutes()).slice(-2)
    );
  };
  const nowTime = timeToString(timestamp.toDate());

  useEffect(() => {
    if (user !== null) {
      db.collection("user")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setState((prevState) => ({ ...prevState, userData: doc.data() }));
          } else {
            console.log("404");
          }
        })
        .catch((error) => {
          console.log(`データを取得できませんでした (${error})`);
        });
      db.collection("user")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setLastTimeLat(data.lat);
            setLastTimeLng(data.lng);
          } else {
            console.log("404");
          }
        })
        .catch((error) => {
          console.log(`データを取得できませんでした (${error})`);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      if (
        booleanState.share === true &&
        ((lat !== null && lng !== null) ||
          (lat !== lastTimeLat && lng !== lastTimeLng))
      ) {
        navigator.geolocation.watchPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            db.collection("user")
              .doc(user.uid)
              .set(
                {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                { merge: true }
              )
              .then(() => {
                console.log("map register");
              })
              .catch(() => {
                console.log("none...");
              });
          },
          () => {
            alert("現在地を取得できません。");
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
          }
        );
      } else {
        return false;
      }
    }
  }, [lat, lng, lastTimeLat, lastTimeLng, user, booleanState]);

  const lastLocation = (nowTime) => {
    db.collection("user")
      .doc(user.uid)
      .set(
        {
          lastShareTime: nowTime,
        },
        { merge: true }
      )
      .then(() => {
        console.log("map register");
      })
      .catch(() => {
        console.log("none...");
      });
  };

  useEffect(() => {
    if (
      booleanState.adminPosition === true &&
      booleanState.choiceFriendPosition === false &&
      booleanState.surveillanceLocation === true
    ) {
      if (!navigator.geolocation) {
        alert("Geolocationは、あなたのブラウザをサポートしていません。");
      } else {
        navigator.geolocation.watchPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
          },
          () => {
            alert("現在地を取得できません");
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
          }
        );
      }
    } else {
      setCenterPosition({
        lat: Number(choiceFriendLat),
        lng: Number(choiceFriendLng),
      });
    }
  }, [mapSettingState, lng, choiceFriendLat, choiceFriendLng, booleanState]);

  function handleMarkerClick() {
    if (booleanState.detailAccount === false) {
      return setBooleanState((prevState) => ({
        ...prevState,
        detailAccount: true,
      }));
    } else {
      return setBooleanState((prevState) => ({
        ...prevState,
        detailAccount: false,
      }));
    }
  }

  const signOut = () => {
    auth.signOut().then(() => {
      window.location.href = "/signin";
    });
  };

  useEffect(() => {
    if (user !== null) {
      db.collection("user")
        .doc(user.uid)
        .collection("friend")
        .get()
        .then((query) => {
          const id = [];
          query.forEach((doc) => {
            id.push(doc.id);
          });
          setState((prevState) => ({ ...prevState, friendsId: id }));
        })
        .catch((error) => {
          console.log(`データの取得に失敗しました (${error})`);
        });
    }
  }, [user]);

  useEffect(() => {
    const NumberOfTimes = state.friendsId.length;
    if (state.friendsId.length > 0) {
      let location = [];
      for (let i = 0; i < NumberOfTimes; i++) {
        db.collection("user")
          .doc(state.friendsId[i])
          .onSnapshot(
            (docSnapshot) => {
              const data = docSnapshot.data();
              location.push(data);
            },
            (err) => {
              console.log(`Encountered error: ${err}`);
            }
          );
      }
      setTimeout(function () {
        setFriendsLocation(location);
      }, 800);
    } else {
      return false;
    }
  }, [state]);

  const changeBalloon = (key) => {
    const keyNumber = Number(key);
    if (state.currentKey === keyNumber) {
      setState((prevState) => ({ ...prevState, currentKey: -1 }));
    } else {
      setState((prevState) => ({ ...prevState, currentKey: keyNumber }));
    }
  };

  const showProfile = () => {
    if (booleanState.openProfile === true) {
      setBooleanState((prevState) => ({ ...prevState, openProfile: false }));
      setBooleanState((prevState) => ({ ...prevState, active: false }));
    } else {
      setBooleanState((prevState) => ({ ...prevState, openProfile: true }));
    }
  };

  const friendBtn = () => {
    if (booleanState.showFriend === true) {
      setBooleanState((prevState) => ({ ...prevState, showFriend: false }));
      setBooleanState((prevState) => ({ ...prevState, active: false }));
    } else {
      setBooleanState((prevState) => ({ ...prevState, showFriend: true }));
    }
  };

  const myLocation = () => {
    setCenterPosition({ lat: 0, lng: 0 });
    if (lat !== null || lng !== null) {
      setBooleanState((prevState) => ({
        ...prevState,
        choiceFriendPosition: false,
      }));
      setBooleanState((prevState) => ({ ...prevState, adminPosition: true }));
      setCenterPosition({ lat: Number(lat), lng: Number(lng) });
    } else {
      if (!navigator.geolocation) {
        alert("Geolocationは、あなたのブラウザをサポートしていません。");
      } else {
        navigator.geolocation.watchPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            setCenterPosition({
              lat: Number(position.coords.latitude),
              lng: Number(position.coords.longitude),
            });
          },
          () => {
            alert("現在地を取得できません。");
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
          }
        );
      }
    }
  };

  useEffect(() => {
    if (state.messages !== "" && user.uid !== null) {
      db.collection("user")
        .doc(user.uid)
        .collection("friend")
        .doc(choiceFriendId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setOpenMessage(true);
          } else {
            console.log("404");
          }
        })
        .catch((error) => {
          console.log(`データを取得できませんでした (${error})`);
        });
    } else {
      return false;
    }
  }, [user, state, choiceFriendId]);

  useEffect(() => {
    if (user !== "" && choiceFriendId !== "") {
      db.collection("user")
        .doc(user.uid)
        .collection("friend")
        .doc(choiceFriendId)
        .collection("message")
        .orderBy("sendNumber", "asc")
        .limit(20)
        .onSnapshot((snapshot) => {
          const myArray = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            myArray.push({
              id: doc.id,
              message: data.message,
              sendParson: data.sendParson,
              time: data.time,
              sendNumber: data.sendNumber,
            });
          });
          setState((prevState) => ({ ...prevState, messages: myArray }));
        });
    } else {
      return false;
    }
  }, [user, choiceFriendId]);

  const closeMessage = () => {
    if (openMessage === true) {
      setOpenMessage(false);
      setChoiceFriendId("");
      setState((prevState) => ({ ...prevState, messages: "" }));
    } else {
      return false;
    }
  };

  const showSearchFriend = (friendId) => {
    if (booleanState.openSearchFriend === true) {
      setBooleanState((prevState) => ({ ...prevState, searchFriend: false }));
    } else {
      db.collection("user")
        .doc(friendId)
        .get()
        .then((doc) => {
          const data = doc.data();
          setState((prevState) => ({
            ...prevState,
            findFriendName: data.name,
          }));
          setState((prevState) => ({
            ...prevState,
            findFriendImages: data.images,
          }));
          setBooleanState((prevState) => ({
            ...prevState,
            searchFriend: true,
          }));
        });
    }
  };

  const requestFriend = (friendId) => {
    if (booleanState.openRequestFriend === true) {
      setBooleanState((prevState) => ({
        ...prevState,
        openRequestFriend: false,
      }));
    } else {
      setBooleanState((prevState) => ({
        ...prevState,
        openRequestFriend: true,
      }));
      setState((prevState) => ({ ...prevState, requestFriendId: friendId }));
    }
  };

  const choiceFriendLocation = (friendId) => {
    if (friendId !== "") {
      db.collection("user")
        .doc(friendId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setBooleanState((prevState) => ({
              ...prevState,
              choiceFriendPosition: true,
            }));
            setBooleanState((prevState) => ({
              ...prevState,
              adminPosition: false,
            }));
            setCenterPosition({ lat: Number(data.lat), lng: Number(data.lng) });
            setChoiceFriendLat(Number(data.lat));
            setChoiceFriendLng(Number(data.lng));
          } else {
            console.log("404");
          }
        })
        .catch((error) => {
          console.log(`データを取得できませんでした (${error})`);
        });
    }
  };

  const menuBtn = () => {
    if (booleanState.showMenu === true) {
      setBooleanState((prevState) => ({ ...prevState, showMenu: false }));
    } else {
      setBooleanState((prevState) => ({ ...prevState, showMenu: true }));
    }
  };

  const classToggle = () => {
    if (booleanState.active === true) {
      setBooleanState((prevState) => ({ ...prevState, active: false }));
      menuBtn();
    } else {
      setBooleanState((prevState) => ({ ...prevState, active: true }));
      menuBtn();
    }
  };
  const menuToggle = () => {
    setBooleanState((prevState) => ({
      ...prevState,
      active: !booleanState.active,
    }));
  };

  useEffect(() => {
    setTimeout(function () {
      myLocation();
      setBooleanState((prevState) => ({
        ...prevState,
        surveillanceLocation: true,
      }));
    }, 800);
  }, []);

  useEffect(() => {
    setTimeout(function () {
      setBooleanState((prevState) => ({ ...prevState, showGoogleMap: true }));
    }, 1500);
  }, []);

  if (!user) {
    window.location.href = "/signin";
  } else {
    return (
      <div className={Style.App}>
        <Header
          menuBtn={menuBtn}
          classToggle={classToggle}
          active={booleanState.active}
        />
        <div className={Style.ovf}>
          <div>
            <SideBar
              signOut={signOut}
              showProfile={showProfile}
              showSearchFriend={showSearchFriend}
              findFriendName={state.findFriendName}
              findFriendImages={state.findFriendImages}
              name={state.userData.name}
              uid={state.userData.uid}
              requestFriend={requestFriend}
              onClick={choiceFriendLocation}
              myLocation={myLocation}
              setOpenMessage={setOpenMessage}
              setChoiceFriendId={setChoiceFriendId}
            />
            <div style={{ height: "100vh", width: "100%" }}>
              {booleanState.showGoogleMap ? (
                <>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: `${process.env.REACT_APP_GOOGLE_MAP_API}`,
                    }}
                    center={centerPosition}
                    defaultZoom={16}
                    zoom={defaultProps.zoom}
                    options={{ styles: mapSettingState.mapColor }}
                    onChildClick={(key) => changeBalloon(key)}
                  >
                    <Marker
                      className={Style.adminPosition}
                      lat={lat}
                      lng={lng}
                      name="あなた"
                      color="#e96650"
                      onMarkerClick={handleMarkerClick}
                    />
                    {friendsLocation.length > 0 &&
                      friendsLocation.map((list, index) => (
                        <FriendLocation
                          setChoiceFriendId={setChoiceFriendId}
                          key={index}
                          uid={list.uid}
                          lastShareTime={list.lastShareTime}
                          nowTime={nowTime}
                          lat={list.lat}
                          lng={list.lng}
                          name={list.name}
                          bloodType={list.bloodType}
                          nationality={list.nationality}
                          passportNumber={list.passportNumber}
                          currentKey={state.currentKey}
                          index={index}
                        />
                      ))}
                    {booleanState.detailAccount && (
                      <AdminDetail
                        name={state.userData.name}
                        bloodType={state.userData.bloodType}
                        nationality={state.userData.nationality}
                        passportNumber={state.userData.passportNumber}
                        lat={lat}
                        lng={lng}
                      />
                    )}
                  </GoogleMapReact>
                  <div className={Style.shareBx}>
                    {(() => {
                      if (booleanState.share === false) {
                        return (
                          <div
                            className={Style.startShare}
                            onClick={() =>
                              setBooleanState((prevState) => ({
                                ...prevState,
                                share: true,
                              }))
                            }
                          >
                            共有する
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className={Style.stopShare}
                            onClick={() => {
                              setBooleanState((prevState) => ({
                                ...prevState,
                                share: false,
                              }));
                              lastLocation(nowTime);
                            }}
                          >
                            共有しない
                          </div>
                        );
                      }
                    })()}
                    {booleanState.choiceMapMode ? (
                      <ul className={Style.choiceColorMode}>
                        <li
                          onClick={() => {
                            setMapSettingState((prevState) => ({
                              ...prevState,
                              mapColor: normal,
                            }));
                            setBooleanState((prevState) => ({
                              ...prevState,
                              choiceMapMode: false,
                            }));
                          }}
                        >
                          ノーマル
                        </li>
                        <li
                          onClick={() => {
                            setMapSettingState((prevState) => ({
                              ...prevState,
                              mapColor: mapColorDark,
                            }));
                            setBooleanState((prevState) => ({
                              ...prevState,
                              choiceMapMode: false,
                            }));
                          }}
                        >
                          ダーク
                        </li>
                        <li
                          onClick={() => {
                            setMapSettingState((prevState) => ({
                              ...prevState,
                              mapColor: mapColorRight,
                            }));
                            setBooleanState((prevState) => ({
                              ...prevState,
                              choiceMapMode: false,
                            }));
                          }}
                        >
                          ライト
                        </li>
                      </ul>
                    ) : (
                      <span className={Style.toggleChoiceMapMode}>
                        <span
                          onClick={() =>
                            setBooleanState((prevState) => ({
                              ...prevState,
                              choiceMapMode: true,
                            }))
                          }
                          className="material-icons-outlined"
                        >
                          public
                        </span>
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        {openMessage && (
          <div className={Style.messageBx}>
            <Message
              choiceFriendId={choiceFriendId}
              userData={state.userData}
              setChoiceFriendId={setChoiceFriendId}
              user={user}
              setOpenMessage={setOpenMessage}
              closeMessage={closeMessage}
            />
          </div>
        )}
        {booleanState.openProfile && (
          <div className={Style.messageBx}>
            <Profile
              showProfile={showProfile}
              classToggle={classToggle}
              menuToggle={menuToggle}
            />
          </div>
        )}
        {booleanState.openRequestFriend && (
          <div className={Style.messageBx}>
            <Request
              user={user}
              requestFriendId={state.requestFriendId}
              requestFriend={requestFriend}
            />
          </div>
        )}
        {booleanState.showMenu && (
          <HeaderMenu
            showProfile={showProfile}
            myLocation={myLocation}
            menuBtn={menuBtn}
            friendBtn={friendBtn}
            classToggle={classToggle}
            signOut={signOut}
            choiceFriendId={choiceFriendId}
          />
        )}
        {booleanState.showFriend && (
          <FriendList
            friendBtn={friendBtn}
            requestFriend={requestFriend}
            menuBtn={menuBtn}
            menuToggle={menuToggle}
            classToggle={classToggle}
            onClick={choiceFriendLocation}
            showSearchFriend={showSearchFriend}
            findFriendName={state.findFriendName}
            findFriendImages={state.findFriendImages}
            setChoiceFriendId={setChoiceFriendId}
          />
        )}
      </div>
    );
  }
};

export default Dashboard;
