import React, { useState, useEffect, memo } from "react";
import Style from "./Request.module.scss";
import { db } from "../../firebase";
import { deleteRequest, approvalRequest } from "../../apis";
import Logo from "../../asset/loading.svg";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const Request = memo((props) => {
  const { user, requestFriendId } = props;
  const uid = user.uid;
  const [requestName, setRequestName] = useState(""),
    [requestDate, setRequestDate] = useState(""),
    [requestImages, setRequestImages] = useState("");
  const [myName, setMyName] = useState(""),
    [myImages, setMyImages] = useState("");

  useEffect(() => {
    if (user !== "") {
      db.collection("user")
        .doc(uid)
        .collection("request")
        .doc(requestFriendId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setRequestName(data.requestFriendName);
            setRequestDate(data.requestDate);
            setRequestImages(data.requestImages);
          } else {
            console.log("404");
          }
        })
        .catch((error) => {
          console.log(`データを取得できませんでした (${error})`);
        });
    }
  }, [user, requestFriendId, uid]);

  useEffect(() => {
    if (user !== "") {
      db.collection("user")
        .doc(uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            setMyName(data.name);
            setMyImages(data.images);
          } else {
            console.log("404");
          }
        })
        .catch((error) => {
          console.log(`データを取得できませんでした (${error})`);
        });
    }
  }, [user, requestFriendId, uid]);

  const [loading, setLoading] = useState(false);
  const { requestFriend } = props;
  return (
    <div className={Style.requestInner}>
      <React.Fragment>
        <Stack direction="row" spacing={2}>
          {requestImages ? (
            <Avatar
              alt={requestImages.id}
              src={requestImages.path}
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
        <h2>{requestName}</h2>
        <p>リクエスト日：{requestDate}</p>
        {loading ? (
          <img src={Logo} alt="loading" />
        ) : (
          <div className={Style.answerBx}>
            <div
              className={Style.left}
              onClick={() => {
                deleteRequest(requestFriendId, uid);
              }}
            >
              拒否
            </div>
            <div
              className={Style.right}
              onClick={() => {
                setLoading(true);
                approvalRequest(
                  uid,
                  requestFriendId,
                  requestName,
                  requestImages,
                  myName,
                  myImages
                );
              }}
            >
              承認
            </div>
          </div>
        )}
        <div className={Style.closeBtn} onClick={requestFriend}>
          閉じる
        </div>
      </React.Fragment>
    </div>
  );
});

export default Request;
