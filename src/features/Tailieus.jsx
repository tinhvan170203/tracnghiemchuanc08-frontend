import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import commonApi from "../api/commonApi";
import { API_SERVER } from "../api/apiServer";
import { HEADER_1, HEADER_2 } from "../../constant/constant";
import PdfInAppViewer from "../components/PdfInAppViewer";
import SiteFooter from "../components/SiteFooter";

export function getDocTitle(doc) {
  return doc?.tieu_de || doc?.text || "";
}

export function getDocNote(doc) {
  return doc?.chu_thich || "";
}

export function getDocTag(doc) {
  return doc?.ghi_chu || "";
}

export function matchDocSearch(doc, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return true;
  return (
    getDocTitle(doc).toLowerCase().includes(q) ||
    getDocNote(doc).toLowerCase().includes(q) ||
    getDocTag(doc).toLowerCase().includes(q)
  );
}

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

function DocumentCard({ doc, onView }) {
  const title = getDocTitle(doc);
  const note = getDocNote(doc);
  const tag = getDocTag(doc);

  return (
    <button
      type="button"
      onClick={() => onView(doc)}
      className="group block w-full text-left no-underline text-inherit cursor-pointer bg-transparent p-0 border-0"
    >
      <article className="relative flex gap-3 sm:gap-4 rounded-2xl border border-amber-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-orange-400 hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-70 group-hover:opacity-100" />

        <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm sm:text-base font-bold shadow-sm">
          {doc.thutu}
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-2">
          <div>
            {tag ? (
              <span className="inline-flex mb-1.5 max-w-full truncate rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-orange-700">
                {tag}
              </span>
            ) : null}
            <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 leading-snug group-hover:text-orange-700 transition-colors">
              {title}
            </h3>
            {note ? (
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-3">
                {note}
              </p>
            ) : null}
          </div>

          <div className="mt-auto pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 group-hover:bg-orange-100 transition-colors min-h-[40px]">
              Xem tài liệu
              <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
            </span>
          </div>
        </div>
      </article>
    </button>
  );
}

const Tailieus = () => {
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState({ open: false, doc: null });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await commonApi.fetchTailieus();
        setList(res.data || []);
      } catch (error) {
        setList([]);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(
    () => list.filter((doc) => matchDocSearch(doc, search)),
    [list, search]
  );

  const handleView = (doc) => {
    setViewer({ open: true, doc });
  };

  const handleCloseViewer = () => {
    setViewer({ open: false, doc: null });
  };

  const pdfUrl = viewer.doc
    ? `${API_SERVER}api/uploads/${viewer.doc.file}`
    : "";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "rgba(255, 247, 237, 0.85)", pb: 6 }}>
      <PageHeader />

      <Box
        sx={{
          maxWidth: 880,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 3, sm: 4 },
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ mb: 3, textAlign: "center" }}>
          {/* <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(234, 88, 12, 0.25)",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 22 }} />
          </Box> */}
          {/* <Typography
            component="h1"
            fontWeight={800}
            sx={{
              textTransform: "uppercase",
              fontSize: { xs: "1.05rem", sm: "1.25rem" },
              letterSpacing: 0.4,
              color: "#1e293b",
              lineHeight: 1.35,
            }}
          >
            CẨM nang an toàn giao thông
          </Typography> */}
          <Typography variant="body2" className="!text-[16px] !font-semibold" sx={{ color: "#64748b" }}>
            Tài liệu pháp luật và tuyên truyền ATGT 
          </Typography>
        </Stack>

        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tiêu đề, ghi chú hoặc chú thích..."
          sx={{
            mb: 3,
            bgcolor: "white",
            borderRadius: 2,
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

        {!loading && list.length > 0 && (
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 1.5, color: "#94a3b8", fontWeight: 600 }}
          >
            {filtered.length} tài liệu
            {search.trim() ? ` · kết quả tìm kiếm` : ""}
          </Typography>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: "#ea580c" }} />
          </Box>
        ) : list.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px dashed #fdba74",
              bgcolor: "rgba(255,255,255,0.7)",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 44, color: "#fdba74", mb: 1 }} />
            <Typography color="text.secondary">Chưa có tài liệu nào.</Typography>
          </Paper>
        ) : filtered.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #fed7aa",
              bgcolor: "white",
            }}
          >
            <Typography color="text.secondary">
              Không tìm thấy tài liệu phù hợp. Thử từ khóa khác.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {filtered.map((doc) => (
              <DocumentCard key={doc._id} doc={doc} onView={handleView} />
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      <SiteFooter />
      <PdfInAppViewer
        open={viewer.open}
        onClose={handleCloseViewer}
        title={viewer.doc ? getDocTitle(viewer.doc) : ""}
        url={pdfUrl}
      />
    </Box>
  );
};

export default Tailieus;
