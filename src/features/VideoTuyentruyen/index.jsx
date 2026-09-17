import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import VideoPage from "./VideoPage.jsx";
import videoApi from "../../api/videoApi";

export default function VideoTuyentruyen() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await videoApi.getVideos();
        setVideos(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách video:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          bgcolor: "#fff7ed",
        }}
      >
        <CircularProgress sx={{ color: "#ea580c" }} />
        <Typography variant="body2" color="text.secondary">
          Đang tải video tuyên truyền...
        </Typography>
      </Box>
    );
  }

  return <VideoPage videoList={videos} />;
}
