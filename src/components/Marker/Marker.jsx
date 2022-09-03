import React from "react";
import Style from "./Marker.module.scss";

const Marker = (props) => {
  const { color, name, onMarkerClick } = props;
  return (
    <div onClick={onMarkerClick}>
      <div
        className={`${Style.pin} ${Style.bounce}`}
        style={{ backgroundColor: color, cursor: "pointer" }}
        title={name}
      />
      <div className={Style.pulse} />
    </div>
  );
};

export default Marker;
