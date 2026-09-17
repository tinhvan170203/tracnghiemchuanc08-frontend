/**

 * Helpers for sync Excel blob vs async export job responses.

 */



export async function getBlobErrorMessage(error, fallback = "Không xuất được file Excel") {

  const data = error?.response?.data ?? error?.data ?? null;



  if (data instanceof Blob) {

    try {

      const text = await data.text();

      const parsed = JSON.parse(text);

      if (parsed?.message) return parsed.message;

    } catch (_) {

      /* ignore */

    }

  }



  if (typeof data?.message === "string" && data.message) {

    return data.message;

  }



  if (error?.code === "ECONNABORTED") {

    return "Xuất Excel quá lâu, yêu cầu đã hết thời gian chờ. Thử lọc bớt dữ liệu hoặc xuất từng cuộc.";

  }



  return error?.message || fallback;

}



export async function assertExcelBlobResponse(res, fallback = "Không xuất được file Excel") {

  const contentType = res.headers?.["content-type"] || "";

  if (contentType.includes("application/json")) {

    const text = await res.data.text();

    const parsed = JSON.parse(text);

    throw new Error(parsed.message || fallback);

  }

  return res.data;

}



/**

 * Phân biệt phản hồi file Excel đồng bộ và job async (JSON).

 * Dùng khi API có thể trả blob xlsx hoặc JSON { mode: 'async', jobId }.

 */

export async function parseExportResponse(res) {

  const contentType = res.headers?.["content-type"] || "";

  const isJson =

    contentType.includes("application/json") ||

    (typeof res.data === "object" &&

      res.data !== null &&

      !(res.data instanceof Blob) &&

      !(res.data instanceof ArrayBuffer));



  if (isJson) {

    let parsed = res.data;

    if (parsed instanceof Blob) {

      const text = await parsed.text();

      parsed = JSON.parse(text);

    }

    if (parsed?.mode === "async" || parsed?.jobId || parsed?.status) {

      return { type: "job", job: parsed };

    }

    throw new Error(parsed?.message || "Không xuất được file");

  }



  if (res.data instanceof Blob) {

    const maybeType = res.data.type || "";

    if (maybeType.includes("application/json")) {

      const text = await res.data.text();

      const parsed = JSON.parse(text);

      if (parsed?.mode === "async" || parsed?.jobId) {

        return { type: "job", job: parsed };

      }

      throw new Error(parsed?.message || "Không xuất được file");

    }

  }



  return { type: "blob", data: res.data };

}



export function downloadBlobFile(data, filename, mimeType) {

  const blob =

    data instanceof Blob

      ? data

      : new Blob([data], { type: mimeType || "application/octet-stream" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = filename;

  document.body.appendChild(a);

  a.click();

  a.remove();

  window.URL.revokeObjectURL(url);

}



export const EXPORT_JOB_POLL_MS = 2000;

export const EXPORT_JOB_TIMEOUT_MS = 60 * 60 * 1000;



/**

 * Poll trạng thái job đến ready/failed/timeout.

 * onProgress(job) optional.

 */

export async function waitForExportJob(getJobFn, jobId, { onProgress, signal } = {}) {

  const started = Date.now();

  while (true) {

    if (signal?.aborted) {

      throw new Error("Đã hủy theo dõi job xuất");

    }

    if (Date.now() - started > EXPORT_JOB_TIMEOUT_MS) {

      throw new Error(

        "Job xuất chạy quá lâu. Bạn có thể tải lại trang và kiểm tra lại sau."

      );

    }

    const res = await getJobFn(jobId);

    const job = res?.data || res;

    if (typeof onProgress === "function") onProgress(job);



    if (job.status === "ready") return job;

    if (job.status === "failed") {

      throw new Error(job.error || "Xuất file thất bại");

    }

    await new Promise((resolve) => setTimeout(resolve, EXPORT_JOB_POLL_MS));

  }

}

