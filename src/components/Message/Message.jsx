import React, { memo, useState, useEffect, useCallback } from "react";
import { sendMessage } from "../../apis";
import { db, FirebaseTimestamp } from "../../firebase";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import TextBox from "../TextBox/TextBox";
import Style from "./Message.module.scss";
import SendIcon from "@mui/icons-material/Send";

const Message = memo((props) => {
  const { user, choiceFriendId, userData, setOpenMessage, closeMessage } =
    props;
  const uid = user.uid;
  const [messageFriendName, setMessageFriendName] = useState("");
  const [messageFriendImages, setMessageFriendImages] = useState("");
  const [messages, setMessages] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const inputNewMessage = useCallback(
    (event) => {
      setNewMessage(event.target.value);
    },
    [setNewMessage]
  );
  const timestamp = FirebaseTimestamp.now();
  const number = (date) => {
    return (
      date.getFullYear() +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      ("00" + date.getDate()).slice(-2) +
      ("00" + date.getHours()).slice(-2) +
      ("00" + date.getMinutes()).slice(-2) +
      ("00" + date.getSeconds())
    );
  };
  const dateToString = (date) => {
    return (
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + date.getDate()).slice(-2)
    );
  };
  const timesToString = (date) => {
    return (
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2)
    );
  };
  const sendNumber = number(timestamp.toDate());
  const date = dateToString(timestamp.toDate());
  const time = timesToString(timestamp.toDate());

  useEffect(() => {
    if (messages !== "") {
      db.collection("user")
        .doc(uid)
        .collection("friend")
        .doc(choiceFriendId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setMessageFriendName(data.name);
            setMessageFriendImages(data.images);
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
  }, [user, messages, choiceFriendId, setOpenMessage, uid]);

  useEffect(() => {
    if (user !== "" && choiceFriendId !== "") {
      db.collection("user")
        .doc(uid)
        .collection("friend")
        .doc(choiceFriendId)
        .collection("message")
        .orderBy("sendNumber", "asc")
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
          setMessages(myArray);
        });
    } else {
      return false;
    }
  }, [user, choiceFriendId, uid]);

  useEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

  useEffect(() => {
    const scrollArea = document.getElementById("scroll-bx");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

  return (
    <div className={Style.messageBxWrapper}>
      <div className={Style.messageBxInner} id="scroll-area">
        <div className={Style.choiceFriendName}>
          <Stack direction="row" spacing={2} className={Style.avatarBx}>
            {messageFriendImages ? (
              <Avatar
                alt={messageFriendImages.id}
                src={messageFriendImages.path}
                className={Style.avatar}
              />
            ) : (
              <Avatar
                src="../../public/no-images.jpeg"
                className={Style.avatar}
              />
            )}
          </Stack>
          <p>{messageFriendName}</p>
        </div>
        <ul className={Style.openMessageBx} id="scroll-bx">
          {messages.length > 0 &&
            messages.map((list, index) => (
              <React.Fragment key={index}>
                {(() => {
                  if (user.uid !== list.sendParson) {
                    return (
                      <li className={Style.friendMessage}>
                        <span className={Style.friendMessageBx}>
                          <Stack
                            direction="row"
                            spacing={2}
                            className={Style.avatarBx}
                          >
                            {messageFriendImages ? (
                              <Avatar
                                alt={messageFriendImages.id}
                                src={messageFriendImages.path}
                                className={Style.avatar}
                              />
                            ) : (
                              <Avatar
                                src="../../public/no-images.jpeg"
                                className={Style.avatar}
                              />
                            )}
                          </Stack>
                          <span className={Style.friendTxt}>
                            <p>{list.message}</p>
                            <span></span>
                          </span>
                        </span>
                      </li>
                    );
                  } else {
                    return (
                      <li className={Style.myMessage}>
                        <span className={Style.myMessageBx}>
                          <span className={Style.friendTxt}>
                            <p>{list.message}</p>
                            <span></span>
                          </span>
                          <Stack
                            direction="row"
                            spacing={2}
                            className={Style.avatarBx}
                          >
                            {userData.images ? (
                              <Avatar
                                alt={userData.images.id}
                                src={userData.images.path}
                                className={Style.avatar}
                              />
                            ) : (
                              <Avatar
                                src="../../public/no-images.jpeg"
                                className={Style.avatar}
                              />
                            )}
                          </Stack>
                        </span>
                      </li>
                    );
                  }
                })()}
              </React.Fragment>
            ))}
        </ul>
        <div className={Style.messageSubmitBx}>
          <div className={Style.left}>
            <TextBox
              className={"inputBx"}
              label={"メッセージ"}
              type={"text"}
              InputLabelProps={{ shrink: true }}
              variant={"standard"}
              value={newMessage}
              onChange={inputNewMessage}
            />
          </div>
          <div
            className={Style.right}
            onClick={() => {
              sendMessage(
                user.uid,
                newMessage,
                choiceFriendId,
                sendNumber,
                time,
                date
              );
              setNewMessage("");
            }}
          >
            <div className={Style.submitBtn}>
              <span>
                <SendIcon />
              </span>
            </div>
          </div>
        </div>
        <div className={Style.messageCloseBtn} onClick={closeMessage}>
          閉じる
        </div>
      </div>
    </div>
  );
});

export default Message;
