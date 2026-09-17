import React, { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { API_SERVER } from "../../api/apiServer";
import videoApi from "../../api/videoApi";

function buildVideoUrl(video) {
  if (!video) return null;
  return video.is_source_link_orther
    ? video.link_orther
    : `${API_SERVER}api/public/${video.link}`;
}

function VideoPlayerPanel({ video }) {
  const [url, setUrl] = useState(null);
  const [totalView, setTotalView] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (!video?._id) {
      setUrl(null);
      setTotalView(null);
      return undefined;
    }

    let cancelled = false;
    const nextUrl = buildVideoUrl(video);
    setUrl((prev) => (prev === nextUrl ? prev : nextUrl));
    setTotalView(video.totalView ?? null);

    const tangView = async () => {
      try {
        const res = await videoApi.incView({ id: video._id });
        if (!cancelled) {
          setTotalView(res.data.totalView);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    tangView();
    return () => {
      cancelled = true;
    };
  }, [video?._id]);

  const handleCopyLink = useCallback(() => {
    if (!url) return;
    navigator.clipboard
      .writeText(url)
      .then(() => setOpenSnackbar(true))
      .catch((err) => console.error("Lỗi khi sao chép link:", err));
  }, [url]);

  if (!video) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: "1px dashed #fdba74",
          bgcolor: "rgba(255,255,255,0.85)",
          minHeight: { xs: 220, sm: 320 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          textAlign: "center",
        }}
      >
        <PlayCircleOutlineIcon sx={{ fontSize: 56, color: "#fdba74" }} />
        <Typography fontWeight={700} color="text.secondary">
          Chưa có video để phát
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
          Chọn một video trong danh sách bên cạnh để xem nội dung tuyên truyền.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 2 },
        borderRadius: 3,
        border: "1px solid #fed7aa",
        bgcolor: "#fff",
        boxShadow: "0 8px 28px rgba(234, 88, 12, 0.08)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          paddingTop: "56.25%",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#0f172a",
        }}
      >
        {url && (
          <ReactPlayer
            key={video._id}
            src={url}
            controls
            playing
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
            fallback={
              <div className="flex items-center justify-center h-full text-white">
                Đang tải video...
              </div>
            }
          />
        )}
      </Box>

      <Box sx={{ mt: { xs: 1.75, sm: 2.25 }, px: { xs: 0.5, sm: 0.5 } }}>
     <p className="text-[15px] font-semibold">
          {video.name}
        </p>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ mt: 1.25 }}
        >
          <Chip
            icon={<RemoveRedEyeOutlinedIcon sx={{ fontSize: "16px !important" }} />}
            label={`${totalView ?? "…"} lượt xem`}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: "#fff7ed",
              color: "#9a3412",
              "& .MuiChip-icon": { color: "#ea580c" },
            }}
          />
          <Tooltip title="Sao chép liên kết để chia sẻ">
            <IconButton
              onClick={handleCopyLink}
              size="small"
              sx={{
                border: "1px solid #fed7aa",
                color: "#ea580c",
                bgcolor: "#fff7ed",
                "&:hover": { bgcolor: "#ffedd5" },
              }}
            >
              <ShareOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {(video.mota || "").trim() ? (
          <Typography
            sx={{
              mt: 1.5,
              color: "#475569",
              lineHeight: 1.65,
              fontSize: { xs: "0.875rem", sm: "0.95rem" },
              whiteSpace: "pre-line",
            }}
            className="!text-[13px]"
          >
            {video.mota}
          </Typography>
        ) : null}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Đã sao chép đường dẫn video để chia sẻ!
        </Alert>
      </Snackbar>
    </Paper>
  );
}

function areEqual(prev, next) {
  return prev.video?._id === next.video?._id;
}

export default React.memo(VideoPlayerPanel, areEqual);
