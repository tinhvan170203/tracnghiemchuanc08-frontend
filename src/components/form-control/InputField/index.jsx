import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";


export const InputField = (props) => {
  const { name, label, disabled, form,type,value } = props;
 
  const {
    formState: { errors },
    formState,
  } = form; // trong react-hook-form API có giải thích

  const hasError = errors[name] && formState.touchedFields[name];

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <TextField
          name={name}
          focused
          inputProps={{
    style: {
      // fontSize: 24, // Chỉnh size chữ ở đây
      padding: 6,  // Có thể chỉnh thêm padding nếu chữ quá to
    },
  }}
          sx={{
            "& .MuiFormHelperText-root": {color: '#d32f2f'},//styles the label
            // fontSize: "12px"
            // "& .MuiOutlinedInput-root": {
            //   "& > fieldset": { borderColor: "#ab0000" },
            // },
            // "& .MuiOutlinedInput-root:hover": {
            //   "& > fieldset": {
            //     borderColor: "#ab0000",
            //     borderWidth: '1px'
            //   }
            // }
          }}
           autoComplete="on"
          // multiline
          // value={value}
           // 2. Chỉnh size nhãn (Label)
  InputLabelProps={{ style: { fontSize: 13 } }} 
          {...field}
          type={type}
          // maxRows={3}
          margin="normal"
          label={label}
          fullWidth
          size="small"
          disabled={disabled}
          error={hasError}
          helperText={errors[name]?.message}
        />
      )}
    />
  );
};
