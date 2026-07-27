import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Paper,
    Divider,
    Snackbar,
    Alert,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import { API_SERVER } from "../../api/apiServer";
import videoApi from "../../api/videoApi";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ReplyIcon from '@mui/icons-material/Reply';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { HEADER_1, HEADER_2 } from "../../../constant/constant";
export default function VideoPage({ videoList = [] }) {
    // State lưu video đang được chọn để phát (mặc định lấy video đầu tiên)
    const [selectedVideo, setSelectedVideo] = useState(null);

    // State quản lý thông báo Snackbar khi copy link
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [totalView, setTotalView] = useState(null);

    const [url, setUrl] = useState(null);

    useEffect(() => {
        const tangView = async () => {
            try {
                let res = await videoApi.incView({ id: selectedVideo._id });
                setTotalView(res.data.totalView)
            } catch (error) {
                console.log(error.message)
            }
        };

        if (selectedVideo) {
            tangView();
            let checkLink = selectedVideo.is_source_link_orther ? selectedVideo.link_orther : `${API_SERVER}public/${selectedVideo.link}`
            setUrl(checkLink)
        }
    }, [selectedVideo]);

    // 3. Hàm xử lý Copy đường dẫn video
    const handleCopyLink = () => {
        // if (!selectedVideo?.link) return;
        // Tạo đường dẫn hoàn chỉnh tới file video
        const fullLink = url;

        navigator.clipboard.writeText(fullLink)
            .then(() => {
                setOpenSnackbar(true); // Bật thông báo copy thành công
            })
            .catch((err) => {
                console.error("Lỗi khi sao chép link:", err);
            });
    };

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
                    <div className="flex items-center justify-center" >
                        <img src="/cong-an-hieu.png" className="md:w-24 w-12" />
                        <img src="/logoc08.png" className="md:w-[64px] w-8" />
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
                {/* ================= COLUMN 1: KHUNG PHÁT VIDEO CHÍNH ================= */}
                <Grid
                    item
                    xs={12}
                    lg={8}
                    sx={{
                        // 🎯 BẬT STICKY CHO CẢ MOBILE VÀ DESKTOP (Giống hệt YouTube)
                        position: "sticky",
                        top: { xs: 0, lg: 16 }, // Mobile dính sát mép trên (0px), Desktop hở ra 16px
                        zIndex: 1100,           // Đảm bảo video luôn đè lên các phần tử khác khi cuộn
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 1, sm: 2 },
                            borderRadius: { xs: 2, sm: 3 },
                            bgcolor: "#ffffff",
                        }}
                    >
                        {selectedVideo ? (
                            <>
                                {/* Khung Player Aspect Ratio 16:9 */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        paddingTop: "56.25%", /* 16:9 Aspect Ratio */
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        bgcolor: "#000000",
                                    }}
                                >
                                    <ReactPlayer
                                        key={selectedVideo._id} // Tránh lỗi AbortError play()
                                        src={`${url}`}
                                        controls
                                        playing={true}
                                        width="100%"
                                        height="100%"
                                        style={{ position: "absolute", top: 0, left: 0 }}
                                        fallback={
                                            <div className="flex items-center justify-center h-full text-white">
                                                Đang tải video...
                                            </div>
                                        }
                                    />
                                </Box>

                                {/* Thông tin chi tiết Video */}
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
                                        <VideoCameraBackIcon className="!text-orange-600" />  {selectedVideo.name}
                                    </Typography>
                                    <p className="text-[12px] items-center justify-between flex space-x-1">
                                        <div className="flex space-x-1 items-center">
                                            <RemoveRedEyeIcon fontSize="16" />
                                            <span className="font-semibold">{totalView}</span>
                                            <span className="text-[11px] text-gray-500">lượt xem</span>
                                        </div>

                                        <div>
                                            {/* Nút ReplyIcon thực hiện Copy Link khi click */}
                                            <button
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
                                            WebkitLineClamp: 3, // 👈 Đã chỉnh thành 3 dòng
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                        className="!text-[11px]"
                                    >
                                        {selectedVideo.mota || "Không có mô tả cho video này."}
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
                    </Paper>
                </Grid>

                {/* ================= COLUMN 2: DANH SÁCH VIDEO BÊN CẠNH / BÊN DƯỚI ================= */}
                <Grid item xs={12} lg={4}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            borderRadius: 3,

                            // 🎯 Tối ưu chiều cao cho cả 2 chế độ:
                            // Mobile: Cho phép trôi tự nhiên dưới video sticky
                            // Desktop: Giới hạn chiều cao và hiện thanh cuộn riêng
                            maxHeight: { lg: "calc(100vh - 32px)" },
                            overflowY: { lg: "auto" },

                            // Custom thanh cuộn đẹp mắt cho Desktop
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
                            {videoList.map((item) => {
                                const isSelected = selectedVideo?._id === item._id;

                                return (
                                    <Card
                                        key={item._id}
                                        onClick={() => setSelectedVideo(item)}
                                        sx={{
                                            display: "flex",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease-in-out",
                                            border: isSelected
                                                ? "2px solid #2563eb"
                                                : "1px solid #e2e8f0",
                                            bgcolor: isSelected ? "#eff6ff" : "#ffffff",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                                boxShadow: 3,
                                            },
                                        }}
                                    >
                                        {/* Thumbnail Video cắt khung hình thật (Phong cách YouTube) */}
                                        <Box
                                            sx={{
                                                width: { xs: 110, sm: 125 },
                                                minWidth: { xs: 110, sm: 125 },
                                                height: 70,
                                                borderRadius: 1.5,
                                                overflow: "hidden",
                                                bgcolor: "#000000",
                                                position: "relative",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                m: 1, // Tạo lề xung quanh thẻ ảnh
                                            }}
                                        >
                                            {/* Thẻ video tự động lấy khung hình ở giây 0.5 làm ảnh bìa */}

                                            <video
                                                src={!item.is_source_link_orther ? `${API_SERVER}public/${item.link}#t=0.5` : `${item.link_orther}#t=0.5`}
                                                preload="metadata"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover", // Giúp ảnh thumbnail bao phủ trọn khung không bị méo
                                                }}
                                            />
                                           
                                            {/* Lớp phủ làm tối nhẹ để hiện Icon Play đè lên trên */}
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    bgcolor: isSelected ? "rgba(37, 99, 235, 0.3)" : "rgba(0, 0, 0, 0.2)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    transition: "background-color 0.2s",
                                                    "&:hover": {
                                                        bgcolor: "rgba(0, 0, 0, 0.4)",
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
                                                    WebkitLineClamp: 2, // 👈 Đã chỉnh thành 3 dòng
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
                            })}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Thông báo bật lên khi đã sao chép link thành công */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2500}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Đã sao chép đường dẫn video vào bộ nhớ tạm để chia sẻ!
                </Alert>
            </Snackbar>
        </Box>
    );
}