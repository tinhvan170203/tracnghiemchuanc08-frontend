import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QRCode from "react-qr-code";

const QR_SIZE = 1200;
const LOGO_URL = "/cong-an-hieu.png";

const sanitizeFileName = (name) => {
  const safeName = String(name || "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[.\s]+$/g, "")
    .trim()
    .slice(0, 120);

  return safeName || "QR-cuoc-danh-gia";
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const DownloadQRCodeButton = ({ assessmentId, assessmentName }) => {
  const qrContainerRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const assessmentUrl = `${window.location.origin}/${assessmentId}`;

  const handleDownload = async () => {
    const svg = qrContainerRef.current?.querySelector("svg");
    if (!svg || downloading) return;

    setDownloading(true);
    let svgUrl;

    try {
      const serializedSvg = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([serializedSvg], {
        type: "image/svg+xml;charset=utf-8",
      });
      svgUrl = URL.createObjectURL(svgBlob);

      const qrImage = await loadImage(svgUrl);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = QR_SIZE;
      canvas.height = QR_SIZE;
      context.imageSmoothingEnabled = false;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, QR_SIZE, QR_SIZE);
      context.drawImage(qrImage, 0, 0, QR_SIZE, QR_SIZE);

      try {
        const logo = await loadImage(LOGO_URL);
        const logoSize = Math.round(QR_SIZE * 0.18);
        const logoX = Math.round((QR_SIZE - logoSize) / 2);
        const logoY = Math.round((QR_SIZE - logoSize) / 2);
        const padding = 14;

        context.fillStyle = "#ffffff";
        context.fillRect(
          logoX - padding,
          logoY - padding,
          logoSize + padding * 2,
          logoSize + padding * 2
        );
        context.drawImage(logo, logoX, logoY, logoSize, logoSize);
      } catch {
        // QR vẫn tải được nếu logo không tồn tại hoặc tải lỗi.
      }

      const downloadLink = document.createElement("a");
      downloadLink.download = `${sanitizeFileName(assessmentName)}.png`;
      downloadLink.href = canvas.toDataURL("image/png", 1);
      downloadLink.click();
    } finally {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
      setDownloading(false);
    }
  };

  return (
    <>
      <Tooltip title="Tải mã QR cuộc đánh giá">
        <span>
          <Button
            variant="contained"
            color="info"
            size="small"
            style={{ marginLeft: "4px", minWidth: "40px" }}
            disabled={downloading || !assessmentId}
            onClick={handleDownload}
            aria-label={`Tải mã QR ${assessmentName || "cuộc đánh giá"}`}
          >
            <QrCode2Icon style={{ fontSize: "20px" }} />
          </Button>
        </span>
      </Tooltip>

      <div
        ref={qrContainerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-10000px",
          top: "-10000px",
          width: 300,
          height: 300,
          background: "#fff",
        }}
      >
        <QRCode
          value={assessmentUrl}
          size={300}
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
    </>
  );
};

export { sanitizeFileName };
export default DownloadQRCodeButton;
