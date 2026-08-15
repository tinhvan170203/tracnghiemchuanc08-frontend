import React, { useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";
import VideoThumb from "./VideoThumb";

const VideoListItem = React.memo(function VideoListItem({
  item,
  isSelected,
  onSelect,
}) {
  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return (
    <Card
      onClick={handleClick}
      sx={{
        display: "flex",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
        bgcolor: isSelected ? "#eff6ff" : "#ffffff",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <VideoThumb isSelected={isSelected} />

      <CardContent
        sx={{
          p: 1.25,
          "&:last-child": { pb: 1.25 },
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: "bold",
            color: isSelected ? "#1d4ed8" : "#1e293b",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: { xs: "0.85rem", sm: "0.875rem" },
          }}
          className="!text-[12px]"
        >
          {item.name}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{
            mt: 0.5,
            whiteSpace: "pre-line",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          className="!text-[11px]"
        >
          {item.mota}
        </Typography>
      </CardContent>
    </Card>
  );
});

function VideoSidebarList({ videoList, selectedId, onSelect }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        // Mobile + desktop: list scrolls in its own panel so sticky player
        // does not fight page scroll (YouTube-like sidebar behavior).
        maxHeight: {
          xs: "min(55vh, 420px)",
          lg: "calc(100vh - 32px)",
        },
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#cbd5e1",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#94a3b8",
        },
      }}
    >
      <Typography
        variant="h6"
        className="!text-[14px]"
        sx={{ fontWeight: "bold", mb: 2, color: "#0f172a" }}
      >
        Video tuyên truyền ({videoList.length})
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {videoList.map((item) => (
          <VideoListItem
            key={item._id}
            item={item}
            isSelected={selectedId === item._id}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </Paper>
  );
}

function listEqual(prev, next) {
  return (
    prev.selectedId === next.selectedId &&
    prev.onSelect === next.onSelect &&
    prev.videoList === next.videoList
  );
}

export default React.memo(VideoSidebarList, listEqual);
