import React, { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ReplyIcon from "@mui/icons-material/Reply";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
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
    setTotalView(null);

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

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 1, sm: 2 },
        borderRadius: { xs: 2, sm: 3 },
        bgcolor: "#ffffff",
      }}
    >
      {video ? (
        <>
          <Box
            sx={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "#000000",
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

          <Box sx={{ mt: { xs: 1.5, sm: 2.5 } }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#1e293b",
                fontSize: { xs: "1.1rem", sm: "1.5rem" },
              }}
              className="!text-[12px]"
            >
              <VideoCameraBackIcon className="!text-orange-600" /> {video.name}
            </Typography>
            <p className="text-[12px] items-center justify-between flex space-x-1">
              <div className="flex space-x-1 items-center">
                <RemoveRedEyeIcon fontSize="16" />
                <span className="font-semibold">{totalView ?? "…"}</span>
                <span className="text-[11px] text-gray-500">lượt xem</span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Sao chép đường dẫn video"
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-600 hover:text-blue-600 transition"
                >
                  <ReplyIcon fontSize="small" />
                </button>
              </div>
            </p>
            <Divider sx={{ my: 0.5 }} />
            <Typography
              variant="body1"
              sx={{
                color: "#475569",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              className="!text-[11px]"
            >
              {video.mota || "Không có mô tả cho video này."}
            </Typography>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 250,
            bgcolor: "#f1f5f9",
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary">
            Chưa chọn xem video tuyên truyền
          </Typography>
        </Box>
      )}

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
          Đã sao chép đường dẫn video vào bộ nhớ tạm để chia sẻ!
        </Alert>
      </Snackbar>
    </Paper>
  );
}

function areEqual(prev, next) {
  return prev.video?._id === next.video?._id;
}

export default React.memo(VideoPlayerPanel, areEqual);
