import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";


export const InputField = (props) => {
  const { name, label, disabled, form, type, maxLength, inputMode, digitsOnly } = props;
 
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
              padding: 6,
            },
            maxLength,
            inputMode,
          }}
          sx={{
            "& .MuiFormHelperText-root": {color: '#d32f2f'},
          }}
           autoComplete="on"
  InputLabelProps={{ style: { fontSize: 13 } }} 
          {...field}
          onChange={(e) => {
            let value = e.target.value;
            if (digitsOnly) value = value.replace(/\D/g, "");
            if (maxLength) value = value.slice(0, maxLength);
            field.onChange(value);
          }}
          type={type}
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
