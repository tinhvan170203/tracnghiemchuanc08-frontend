import React, { useState } from "react";
import { Controller } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

export const PasswordField = (props) => {
  const { name, label, disabled, form } = props;
    
  const {
    formState: { errors },
    formState,
  } = form; // trong react-hook-form API có giải thích

  const hasError = errors[name] && formState.touchedFields[name];

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Controller
          control={form.control} // controller chỉ có control và name , id
          name={name}
          id={name}
          render={({ field }) => (
            <OutlinedInput
              {...field}
              label={label}
              type={showPassword ? "text" : "password"}
              endAdornment={
                //thêm idon vào cuối phần tử
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              disabled={disabled}
              error={hasError}
            />
          )}
        />
        <FormHelperText error={hasError}>
          {errors[name]?.message}
        </FormHelperText>
      </FormControl>
  );
};
