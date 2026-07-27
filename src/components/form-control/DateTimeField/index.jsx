import { TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import InputLabel from "@mui/material/InputLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

export const DateTimeField = (props) => {
  const { name, label, disabled, form } = props;
  const {
    formState: { errors },
    formState,
  } = form; // trong react-hook-form API có giải thích

  const hasError = errors[name] && formState.touchedFields[name];

  return (
    <FormControl fullWidth size="small" margin="normal">
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <LocalizationProvider style={{ width: '100%' }} dateAdapter={AdapterDayjs}>
            <DatePicker
              {...field}
              label={label}
              disabled={disabled}
              name={name}
              format="DD/MM/YYYY"
              slotProps={{ textField: { variant: 'outlined', size: "small", color: "primary", fullWidth: true, focused: true } }}
            />
          </LocalizationProvider>
        )}
      />
      <FormHelperText
        error={hasError}>{errors[name]?.message}</FormHelperText>
    </FormControl>
  );
};
