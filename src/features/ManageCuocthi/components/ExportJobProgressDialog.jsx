import React from "react";

import {

  Button,

  Dialog,

  DialogActions,

  DialogContent,

  DialogTitle,

  LinearProgress,

  Typography,

} from "@mui/material";



/**

 * Dialog theo dõi tiến độ job xuất kết quả (CSV/ZIP).

 */

export default function ExportJobProgressDialog({

  open,

  job,

  error,

  onClose,

  onDownload,

  downloading,

}) {

  const percent = Math.max(0, Math.min(100, Number(job?.progress?.percent) || 0));

  const processed = job?.progress?.processedRows ?? 0;

  const total = job?.progress?.totalEstimate ?? 0;

  const ready = job?.status === "ready";

  const failed = Boolean(error) || job?.status === "failed";



  return (

    <Dialog open={open} onClose={ready || failed ? onClose : undefined} maxWidth="xs" fullWidth>

      <DialogTitle>Xuất kết quả thi</DialogTitle>

      <DialogContent>

        {failed ? (

          <Typography color="error" variant="body2">

            {error || job?.error || "Xuất file thất bại"}

          </Typography>

        ) : ready ? (

          <Typography variant="body2">

            File đã sẵn sàng{job?.fileName ? `: ${job.fileName}` : ""}.

          </Typography>

        ) : (

          <>

            <Typography variant="body2" sx={{ mb: 1.5 }}>

              {job?.message || "Đang chuẩn bị file…"}

            </Typography>

            <LinearProgress

              variant={total > 0 ? "determinate" : "indeterminate"}

              value={percent}

              sx={{ mb: 1 }}

            />

            <Typography variant="caption" color="text.secondary">

              {total > 0

                ? `${processed.toLocaleString("vi-VN")} / ${total.toLocaleString("vi-VN")} dòng (~${percent}%)`

                : `${processed.toLocaleString("vi-VN")} dòng đã ghi`}

            </Typography>

          </>

        )}

      </DialogContent>

      <DialogActions>

        {(ready || failed) && (

          <Button onClick={onClose} color="inherit">

            Đóng

          </Button>

        )}

        {ready && (

          <Button

            variant="contained"

            onClick={onDownload}

            disabled={downloading}

          >

            {downloading ? "Đang tải…" : "Tải xuống"}

          </Button>

        )}

      </DialogActions>

    </Dialog>

  );

}

