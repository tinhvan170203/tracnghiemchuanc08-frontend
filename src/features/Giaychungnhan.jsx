import React, { forwardRef, useImperativeHandle } from "react";
import { API_SERVER } from "../api/apiServer";

const Giaychungnhan = forwardRef(({ result }, ref) => {
  const handleDownload = async () => {
    try {
      const secretKey = localStorage.getItem("exam_secret_key");
      const mabaithi = result?.mabaithi;

      if (!mabaithi || !secretKey) {
        alert("Thiếu thông tin phiên bài thi để tạo chứng nhận");
        return;
      }

      const response = await fetch(
        `${API_SERVER}c08/certificate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ mabaithi, secretKey })
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Không tạo được chứng nhận");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chungnhan_${mabaithi}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi tạo chứng nhận");
    }
  };

  useImperativeHandle(ref, () => ({
    saveGiaychungnhan: handleDownload
  }));

  return null;
});

export default Giaychungnhan;
