import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

function PdfPages({ url }) {
  const containerRef = useRef(null);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      setRendering(true);
      setError("");
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Không tải được tài liệu PDF");
        }
        const data = await response.arrayBuffer();
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
          const cssScale = Math.min(1.4, containerWidth / baseViewport.width);
          const renderScale = cssScale * pixelRatio;
          const viewport = page.getViewport({ scale: renderScale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", { alpha: false });

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
          canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 12px";
          canvas.style.maxWidth = "100%";
          canvas.style.boxShadow = "0 1px 4px rgba(0,0,0,0.12)";

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

    if (url) renderPdf();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <Box sx={{ position: "relative", minHeight: 240 }}>
      {rendering && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
            py: 8,
          }}
        >
          <CircularProgress size={36} sx={{ color: "#ea580c" }} />
          <Typography variant="body2" color="text.secondary">
            Đang tải tài liệu...
          </Typography>
        </Box>
      )}
      {error && (
        <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>{error}</Box>
      )}
      <div ref={containerRef} style={{ width: "100%" }} />
    </Box>
  );
}

/**
 * Xem PDF ngay trong phần mềm (pdf.js), không mở tab trình duyệt.
 */
export default function PdfInAppViewer({ open, onClose, title, url }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="xl"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          maxHeight: fullScreen ? "100%" : "92vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          pr: 6,
          py: 1.5,
          bgcolor: "#1e3a5f",
          color: "#fff",
          fontWeight: 700,
          fontSize: { xs: "0.95rem", sm: "1.05rem" },
          lineHeight: 1.35,
        }}
      >
        {title || "Xem tài liệu"}
        <IconButton
          aria-label="Đóng"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: { xs: 1, sm: 2 },
          bgcolor: "#f1f5f9",
        }}
      >
        {open && url ? <PdfPages url={url} /> : null}
      </DialogContent>

     
    </Dialog>
  );
}
