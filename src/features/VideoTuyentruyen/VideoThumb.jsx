import React from "react";
import { Box, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

/**
 * Thumbnail tĩnh (không decode video trong list) — trực quan, nhẹ.
 */
function VideoThumb({ isSelected, order }) {
  return (
    <Box
      sx={{
        width: { xs: 88, sm: 108 },
        minWidth: { xs: 88, sm: 108 },
        height: { xs: 56, sm: 64 },
        borderRadius: 1.75,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        background:
          "linear-gradient(145deg, #1e3a5f 0%, #0f172a 45%, #ea580c 160%)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: 4,
          left: 6,
          fontSize: 10,
          fontWeight: 800,
          color: "rgba(255,255,255,0.85)",
          zIndex: 2,
        }}
      >
        #{order}
      </Typography>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isSelected ? "rgba(234, 88, 12, 0.35)" : "rgba(0,0,0,0.2)",
          transition: "background-color 0.2s",
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: isSelected ? "#ea580c" : "rgba(255,255,255,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
          }}
        >
          <PlayArrowRoundedIcon
            sx={{
              fontSize: 22,
              color: isSelected ? "#fff" : "#ea580c",
              ml: "1px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(VideoThumb);
