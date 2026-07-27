import React from "react";
import { Controller } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

export const SelectField = (props) => {
  const { name, label, disabled, form, options} = props;

  const {
    formState: { errors },
    formState,
  } = form; // trong react-hook-form API có giải thích

//   console.log(props)
  const hasError = errors[name] && formState.touchedFields[name];

  return (
    <FormControl fullWidth size="small" margin="normal">
      <InputLabel id={name}>{label}</InputLabel>

      <Controller
        control={form.control}
        name={name}
        render={({field}) => (
            <Select 
                {...field}
                label={label}
                autoWidth={false}
                labelId={name}
                disabled={disabled}
            >
            {options?.length === 0 ? (
              <MenuItem value="" disabled>Không có lựa chọn</MenuItem>
              ) : (
                [
                <MenuItem key="" value="">Tất cả</MenuItem>,
                
                  options?.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))
              ]
            )}
          </Select>
        )}
      />

      <FormHelperText  
        error={hasError}>{errors[name]?.message}</FormHelperText>
    </FormControl>
  );
};
