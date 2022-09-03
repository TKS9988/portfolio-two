import React from "react";
import Style from "./AdminDetail.module.scss";

const AdminDetail = (props) => {
  return (
    <ul className={Style.adminDetail} name="admin detail">
      <li>- あなたの情報 -</li>
      <li>氏名：{props.name}</li>
    </ul>
  );
};

export default AdminDetail;
