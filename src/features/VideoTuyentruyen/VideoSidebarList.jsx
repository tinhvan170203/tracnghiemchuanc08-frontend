import React, { useCallback } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import VideoThumb from "./VideoThumb";

const VideoListItem = React.memo(function VideoListItem({
  item,
  index,
  isSelected,
  onSelect,
}) {
  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(item);
      }
    },
    [item, onSelect]
  );

  return (
    <Box
      component="button"
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={{
        display: "flex",
        width: "100%",
        textAlign: "left",
        gap: 1.25,
        p: 1.25,
        cursor: "pointer",
        borderRadius: 2,
        border: isSelected ? "2px solid #ea580c" : "1px solid #fed7aa",
        bgcolor: isSelected ? "#fff7ed" : "#ffffff",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
        boxShadow: isSelected ? "0 4px 14px rgba(234, 88, 12, 0.12)" : "none",
        "&:hover": {
          borderColor: "#fb923c",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
          transform: "translateY(-1px)",
        },
        "&:focus-visible": {
          outline: "2px solid #ea580c",
          outlineOffset: 2,
        },
      }}
    >
      <VideoThumb isSelected={isSelected} order={item.thutu ?? index + 1} />

      <Box sx={{ flex: 1, minWidth: 0, py: 0.25 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: isSelected ? "#c2410c" : "#1e293b",
            fontSize: { xs: "0.9rem", sm: "0.95rem" },
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.name}
        </Typography>

        {(item.mota || "").trim() ? (
          <Typography
            sx={{
              mt: 0.5,
              color: "#64748b",
              fontSize: "0.78rem",
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              whiteSpace: "pre-line",
            }}
          >
            {item.mota}
          </Typography>
        ) : null}

        {typeof item.totalView === "number" ? (
          <Typography
            sx={{
              mt: 0.75,
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#94a3b8",
            }}
          >
            {item.totalView} lượt xem
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
});

function VideoSidebarList({
  videoList,
  totalCount,
  selectedId,
  onSelect,
  searchActive,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        border: "1px solid #fed7aa",
        bgcolor: "#fff",
        boxShadow: "0 8px 28px rgba(234, 88, 12, 0.06)",
        // Mobile: cuộn cả trang (để player sticky). Desktop: sidebar cuộn riêng.
        maxHeight: {
          xs: "none",
          lg: "calc(100vh - 32px)",
        },
        overflowY: { xs: "visible", lg: "auto" },
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: { lg: "contain" },
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#fdba74",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#fb923c",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography fontWeight={800} sx={{ color: "#9a3412", fontSize: "0.95rem" }}>
          Danh sách video
        </Typography>
        <Typography variant="caption" fontWeight={700} color="text.secondary">
          {searchActive
            ? `${videoList.length}/${totalCount}`
            : `${videoList.length} video`}
        </Typography>
      </Stack>

      {videoList.length === 0 ? (
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {searchActive
              ? "Không tìm thấy video phù hợp."
              : "Chưa có video tuyên truyền."}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {videoList.map((item, index) => (
            <VideoListItem
              key={item._id}
              item={item}
              index={index}
              isSelected={selectedId === item._id}
              onSelect={onSelect}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}

function listEqual(prev, next) {
  return (
    prev.selectedId === next.selectedId &&
    prev.onSelect === next.onSelect &&
    prev.videoList === next.videoList &&
    prev.totalCount === next.totalCount &&
    prev.searchActive === next.searchActive
  );
}

export default React.memo(VideoSidebarList, listEqual);
