import React from "react";
import { Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

/**
 * Static thumbnail (YouTube-lite): no <video> decode in the list.
 */
function VideoThumb({ isSelected }) {
  return (
    <Box
      sx={{
        width: { xs: 110, sm: 125 },
        minWidth: { xs: 110, sm: 125 },
        height: 70,
        borderRadius: 1.5,
        overflow: "hidden",
        bgcolor: "#0f172a",
        backgroundImage:
          "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #334155 100%)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        m: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: isSelected ? "rgba(37, 99, 235, 0.35)" : "rgba(0, 0, 0, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.35)",
          },
        }}
      >
        <PlayArrowIcon
          sx={{
            fontSize: 28,
            color: "#ffffff",
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.6))",
          }}
        />
      </Box>
    </Box>
  );
}

export default React.memo(VideoThumb);
