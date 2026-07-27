import React, { useState } from "react";
import { Controller } from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

export const RadioField = (props) => {
  const { name, label, disabled, form, options, defaultValue } = props;

  const {
    formState: { errors },
    formState,
  } = form; // trong react-hook-form API có giải thích

  const hasError = errors[name] && formState.touchedFields[name];

  return (
    <FormControl fullWidth margin="normal">
      <FormLabel id={name}><span className="font-bold text-black">{label}</span></FormLabel>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <RadioGroup {...field} aria-labelledby={name} defaultValue={defaultValue}>
            {options.map((option) => (
              <FormControlLabel
                value={option.value}
                key={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        )}
      />

      <FormHelperText error={hasError}><span className="text-red-600">{errors[name]?.message}</span></FormHelperText>
    </FormControl>
  );
};

