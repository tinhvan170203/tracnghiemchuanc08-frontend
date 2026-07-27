import React, { forwardRef, useImperativeHandle } from "react";
import { API_SERVER } from "../api/apiServer";

const Giaychungnhan = forwardRef(({ result }, ref) => {
  const handleDownload = async () => {
    try {
      const storedInfo = JSON.parse(
        localStorage.getItem("thongtinthisinh") || "{}"
      );

      const payload = {
        name: result?.name || "",
        tencuocthi: storedInfo?.tencuocthi || "",
        mabaithi: result?.mabaithi || "",
        socaudung: result?.choicedTrue || 0,
        socauhoi: result?.allQuestion || 0,
        time: result?.time || 0,
        thoigianbatdau: result?.thoigianbatdau || ""
      };

      const response = await fetch(
        `${API_SERVER}c08/certificate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error("Không tạo được chứng nhận");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `${payload.name}_${payload.mabaithi}.pdf`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Lỗi tạo chứng nhận");
    }
  };

  useImperativeHandle(ref, () => ({
    saveGiaychungnhan: handleDownload
  }));

  return null;
});

export default Giaychungnhan;