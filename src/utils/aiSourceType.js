/** Nhãn nguồn AiChatLog hiển thị trên UI chi phí */
export function formatAiSourceType(sourceType) {
  const key = String(sourceType || "").trim();
  if (key === "knowledge_upload") return "Upload KB";
  if (key === "file") return "Tài liệu";
  if (key === "web") return "Web";
  if (key === "mixed") return "Hỗn hợp";
  if (key === "none") return "Không khớp";
  return key || "—";
}
