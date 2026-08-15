import React, { useState, useCallback } from "react";
import { Box, Grid } from "@mui/material";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";
import VideoPlayerPanel from "./VideoPlayerPanel";
import VideoSidebarList from "./VideoSidebarList";

export default function VideoPage({ videoList = [] }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSelect = useCallback((item) => {
    setSelectedVideo((prev) => (prev?._id === item?._id ? prev : item));
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 1, sm: 2, md: 3 },
        bgcolor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div className="shadow-md shadow-slate-400 mb-4 md:h-auto bg-center py-2 bg-cover  bg-[url('/nentrongdong.png')] z-10 flex justify-center">
        <div className="">
          <div className="flex items-center justify-center">
            <img src="/cong-an-hieu.png" className="md:w-24 w-12" alt="" />
            <img src="/logoc08.png" className="md:w-[64px] w-8" alt="" />
          </div>
          <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
            {HEADER_1}
          </h3>
          <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
            {HEADER_2}
          </h3>
        </div>
      </div>

      <Grid container spacing={{ xs: 2, lg: 3 }}>
        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            // Sticky only on desktop; on mobile sticky + playing video causes jank.
            position: { xs: "relative", lg: "sticky" },
            top: { lg: 16 },
            zIndex: { lg: 1100 },
          }}
        >
          <VideoPlayerPanel video={selectedVideo} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <VideoSidebarList
            videoList={videoList}
            selectedId={selectedVideo?._id}
            onSelect={handleSelect}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
