import React, { memo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const TextBox = memo((props) => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { margin: "8px 0", width: "100%" },
      }}
      noValidate
      autoComplete="off"
      id="textbox"
    >
      <div>
        <TextField
          className={props.inputBx}
          label={props.label}
          type={props.type}
          InputLabelProps={props.InputLabelProps}
          variant={props.standard}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    </Box>
  );
});

export default TextBox;
