import React, { useState, useEffect } from "react";
import VideoPage from "./VideoPage.jsx";
import axios from "axios";
import videoApi from "../../api/videoApi";

export default function VideoTuyentruyen() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Gọi API fetch danh sách video từ backend
    const fetchVideos = async () => {
      try {
        const res = await videoApi.getVideos();
        // Giả sử API trả về { status: "success", items: [...] }
        setVideos(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy danh sách video:", err);
      }
    };

    fetchVideos();
  }, []);

  return <VideoPage videoList={videos} />;
}