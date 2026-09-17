import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";
import VideoPlayerPanel from "./VideoPlayerPanel";
import VideoSidebarList from "./VideoSidebarList";
import SiteFooter from "../../components/SiteFooter";

function PageHeader() {
  return (
    <div className="shadow-md shadow-slate-400 mb-0 md:h-auto bg-center py-2 bg-cover bg-[url('/nentrongdong.png')] flex justify-center">
      <div>
        <div className="flex items-center justify-center">
          <img src="/cong-an-hieu.png" className="md:w-24 w-12" alt="" />
          <img src="/logoc08.png" className="md:w-[64px] w-8" alt="" />
        </div>
        <h3 className="text-center text-[11px] md:text-lg uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
          {HEADER_1}
        </h3>
        <h3 className="text-center text-[11px] md:text-lg uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
          {HEADER_2}
        </h3>
      </div>
    </div>
  );
}

export default function VideoPage({ videoList = [] }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!videoList.length) {
      setSelectedVideo(null);
      return;
    }
    setSelectedVideo((prev) => {
      if (prev && videoList.some((v) => v._id === prev._id)) return prev;
      return videoList[0];
    });
  }, [videoList]);

  const handleSelect = useCallback((item) => {
    setSelectedVideo((prev) => (prev?._id === item?._id ? prev : item));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return videoList;
    return videoList.filter(
      (v) =>
        (v.name || "").toLowerCase().includes(q) ||
        (v.mota || "").toLowerCase().includes(q)
    );
  }, [videoList, search]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "rgba(255, 247, 237, 0.9)", pb: 5 }}>
      <PageHeader />

      <Box
        sx={{
          width: "100%",
          px: { xs: 1.5, sm: 2, md: 3, xl: 4 },
          pt: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {/* <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                color: "#fff",
                boxShadow: "0 8px 18px rgba(234, 88, 12, 0.28)",
                flexShrink: 0,
              }}
            >
              <OndemandVideoIcon />
            </Box>
            <Box>
              <p className="font-bold text-[14px] uppercase">
                Video tuyên truyền ATGT
              </p>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Chọn video bên cạnh để xem ngay trong phần mềm
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={`${videoList.length} video`}
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              fontWeight: 700,
              bgcolor: "#fff7ed",
              color: "#c2410c",
              border: "1px solid #fed7aa",
            }}
          />
        </Stack> */}

        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc mô tả video..."
          sx={{
            mb: 2.5,
            bgcolor: "white",
            borderRadius: 2,
            maxWidth: { md: 480 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "#fed7aa" },
              "&:hover fieldset": { borderColor: "#fb923c" },
              "&.Mui-focused fieldset": { borderColor: "#ea580c" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "#ea580c" }} />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={{ xs: 2, lg: 3 }}>
          <Grid
            item
            xs={12}
            lg={8}
            sx={{
              // Player sticky trên đầu khi cuộn (mọi kích thước)
              position: "sticky",
              top: { xs: 0, sm: 8 },
              alignSelf: "flex-start",
              zIndex: 1200,
              bgcolor: "rgba(255, 247, 237, 0.96)",
              pb: { xs: 1, lg: 0 },
              mx: { xs: -0.5, lg: 0 },
              px: { xs: 0.5, lg: 0 },
            }}
          >
            <VideoPlayerPanel video={selectedVideo} compactMobile />
          </Grid>

          <Grid item xs={12} lg={4}>
            <VideoSidebarList
              videoList={filtered}
              totalCount={videoList.length}
              selectedId={selectedVideo?._id}
              onSelect={handleSelect}
              searchActive={Boolean(search.trim())}
            />
          </Grid>
        </Grid>
      </Box>

      <SiteFooter />
    </Box>
  );
}
