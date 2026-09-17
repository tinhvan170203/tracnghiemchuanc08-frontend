import React, { useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

/**
 * Select tài khoản có gõ tìm — chiều cao khớp ô date/select (py-3 ≈ 48px).
 * value: string id hoặc "".
 */
export default function CreatorAccountAutocomplete({
  options = [],
  value = "",
  onChange,
  label,
  placeholder = "Tất cả tài khoản — gõ để tìm…",
  size = "medium",
  className = "",
  fullWidth = true,
  disabled = false,
  /** compact: hàng filter Manage; default: khớp form Thống kê */
  variant = "filter",
}) {
  const selected = useMemo(() => {
    if (!value) return null;
    return options.find((u) => String(u._id) === String(value)) || null;
  }, [options, value]);

  const isCompact = size === "small" || variant === "compact";
  const fieldHeight = isCompact ? 34 : 48;

  return (
    <div className={className}>
      {label ? (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
          {label}
        </label>
      ) : null}
      <Autocomplete
        options={options}
        value={selected}
        disabled={disabled}
        fullWidth={fullWidth}
        size={isCompact ? "small" : "medium"}
        clearOnEscape
        autoHighlight
        getOptionLabel={(option) => option?.tentaikhoan || ""}
        isOptionEqualToValue={(a, b) => String(a?._id) === String(b?._id)}
        filterOptions={(opts, state) => {
          const q = String(state.inputValue || "")
            .trim()
            .toLowerCase();
          if (!q) return opts;
          return opts.filter((u) =>
            String(u.tentaikhoan || "")
              .toLowerCase()
              .includes(q)
          );
        }}
        onChange={(_e, next) => {
          onChange?.(next?._id ? String(next._id) : "");
        }}
        noOptionsText="Không tìm thấy tài khoản"
        sx={{
          "& .MuiAutocomplete-inputRoot": {
            paddingTop: "0 !important",
            paddingBottom: "0 !important",
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: fieldHeight,
                minHeight: fieldHeight,
                bgcolor: "#f8fafc",
                borderRadius: isCompact ? "4px" : "12px",
                fontSize: isCompact ? 12 : 14,
                alignItems: "center",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#cbd5e1" },
                "&.Mui-focused fieldset": {
                  borderColor: "#ab0000",
                  borderWidth: 1,
                },
                "& .MuiAutocomplete-input": {
                  padding: isCompact ? "6px 8px !important" : "12px 14px !important",
                },
              },
            }}
          />
        )}
      />
    </div>
  );
}
