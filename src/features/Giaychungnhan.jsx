import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMediaQuery, useTheme } from "@mui/material";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { API_SERVER } from "../api/apiServer";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function fetchCertificateBlob(mabaithi, secretKey) {
  const response = await fetch(`${API_SERVER}api/certificate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mabaithi, secretKey }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Không tạo được chứng nhận");
  }
  return response.blob();
}

function isLikelyMobileOrWebView() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android|iPhone|iPad|iPod|Mobile|Zalo|FBAN|FBAV|Line\//i.test(ua);
}

/** Tải PDF; trên WebView fallback mở blob để người dùng lưu/chia sẻ. */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();

  if (isLikelyMobileOrWebView()) {
    // Nhiều WebView bỏ qua a.download — mở blob để xem/lưu
    setTimeout(() => {
      const opened = window.open(url, "_blank");
      if (!opened) {
        window.location.href = url;
      }
      // Giữ URL một lúc để tải xong; thu hồi sau
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }, 300);
  } else {
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

function waitForContainerWidth(container) {
  if (container.clientWidth > 0) {
    return Promise.resolve(container.clientWidth);
  }

  return new Promise((resolve) => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width > 0) {
        observer.disconnect();
        resolve(width);
      }
    });
    observer.observe(container);
  });
}

function PdfCanvasViewer({ blob }) {
  const containerRef = useRef(null);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      setRendering(true);
      setError("");
      try {
        const data = await blob.arrayBuffer();
        const pdf = await getDocument({ data }).promise;
        const container = containerRef.current;
        if (!container || cancelled) return;

        container.innerHTML = "";
        const containerWidth = await waitForContainerWidth(container);
        if (cancelled) return;

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const cssScale = containerWidth / baseViewport.width;
          const renderScale = cssScale * pixelRatio;
          const viewport = page.getViewport({ scale: renderScale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", { alpha: false });

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
          canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;
          canvas.style.display = "block";
          canvas.style.marginBottom = "8px";

          container.appendChild(canvas);
          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(err.message || "Không hiển thị được PDF");
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [blob]);

  return (
    <Box sx={{ position: "relative", minHeight: 200 }}>
      {rendering && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 6,
          }}
        >
          <CircularProgress size={32} />
        </Box>
      )}
      {error && (
        <Box sx={{ p: 2, textAlign: "center", color: "error.main" }}>{error}</Box>
      )}
      <div ref={containerRef} style={{ width: "100%" }} />
    </Box>
  );
}

/** Ưu tiên iframe blob; WebView lỗi PDF thì fallback canvas (đã polyfill). */
function CertificateViewer({ blob }) {
  const [blobUrl, setBlobUrl] = useState("");
  const [useCanvas, setUseCanvas] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    setUseCanvas(false);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  if (useCanvas) {
    return <PdfCanvasViewer blob={blob} />;
  }

  if (!blobUrl) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: { xs: "70vh", md: 480 } }}>
      <Box
        component="iframe"
        title="Giấy chứng nhận"
        src={blobUrl}
        sx={{
          width: "100%",
          height: { xs: "70vh", md: 520 },
          border: "none",
          borderRadius: 1,
          bgcolor: "#f5f5f5",
        }}
        onError={() => setUseCanvas(true)}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1, textAlign: "center" }}
      >
        Nếu khung trống, bấm &quot;Xem dạng ảnh&quot; hoặc &quot;Tải về&quot;.
      </Typography>
      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Button size="small" onClick={() => setUseCanvas(true)}>
          Xem dạng ảnh
        </Button>
      </Box>
    </Box>
  );
}

const Giaychungnhan = forwardRef(({ result }, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const blobRef = useRef(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewBlob, setViewBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBlob = async () => {
    const secretKey = localStorage.getItem("exam_secret_key");
    const mabaithi = result?.mabaithi;
    if (!mabaithi || !secretKey) {
      throw new Error("Thiếu thông tin phiên bài thi để tạo chứng nhận");
    }
    if (blobRef.current) return blobRef.current;
    const blob = await fetchCertificateBlob(mabaithi, secretKey);
    blobRef.current = blob;
    return blob;
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const blob = await getBlob();
      triggerDownload(blob, `chungnhan_${result?.mabaithi}.pdf`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi tạo chứng nhận");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    try {
      setLoading(true);
      const blob = await getBlob();
      setViewBlob(blob);
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi tạo chứng nhận");
    } finally {
      setLoading(false);
    }
  };

  const closeView = () => {
    setViewOpen(false);
    setViewBlob(null);
  };

  useImperativeHandle(ref, () => ({
    saveGiaychungnhan: handleDownload,
    xemGiaychungnhan: handleView,
    dangTai: loading,
  }));

  return (
    <Dialog
      open={viewOpen}
      onClose={closeView}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ py: 1.5 }}>Giấy chứng nhận</DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: { xs: 1, md: 2 },
          flex: 1,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {viewBlob && <CertificateViewer blob={viewBlob} />}
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1 }}>
        <Button onClick={closeView}>Đóng</Button>
        <Button variant="contained" onClick={handleDownload} disabled={loading}>
          Tải về
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default Giaychungnhan;
