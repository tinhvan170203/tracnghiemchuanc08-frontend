import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Upload,
  Table,
  Button,
  Tag,
  Popconfirm,
  message,
  Card,
  Typography,
  Space,
  Tooltip,
  Input,
} from "antd";
import {
  InboxOutlined,
  ReloadOutlined,
  DeleteOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import knowledgeApi from "../../api/knowledgeApi";
import "antd/dist/reset.css";

const { Dragger } = Upload;
const { Title, Paragraph, Text } = Typography;

const statusMap = {
  processing: { color: "processing", text: "Đang xử lý" },
  ready: { color: "success", text: "Sẵn sàng" },
  failed: { color: "error", text: "Lỗi" },
};

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AiKnowledge() {
  const roles = useSelector((state) => state.authReducer.roles_x01);
  const canAdd = roles && roles.includes("thêm tài liệu AI");
  const canDelete = roles && roles.includes("xóa tài liệu AI");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reprocessingId, setReprocessingId] = useState(null);
  const [documentCode, setDocumentCode] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await knowledgeApi.list();
      setItems(res.data?.items || []);
    } catch (err) {
      message.error(err?.message || "Không tải được danh sách file");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
    const timer = setInterval(fetchList, 8000);
    return () => clearInterval(timer);
  }, [fetchList]);

  const handleUpload = async (file) => {
    const allowed = [".pdf", ".docx", ".txt"];
    const name = file.name || "";
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      message.error("Chỉ chấp nhận PDF, DOCX, TXT");
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (documentCode.trim()) formData.append("documentCode", documentCode.trim());
    if (effectiveDate.trim()) formData.append("effectiveDate", effectiveDate.trim());
    setUploading(true);
    try {
      await knowledgeApi.upload(formData);
      message.success("Đã upload, hệ thống đang tạo embedding...");
      await fetchList();
    } catch (err) {
      message.error(err?.message || "Upload thất bại");
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleDelete = useCallback(
    async (id) => {
      try {
        await knowledgeApi.remove(id);
        message.success("Đã xóa file");
        fetchList();
      } catch (err) {
        message.error(err?.message || "Xóa thất bại");
      }
    },
    [fetchList]
  );

  const handleReprocess = useCallback(
    async (id) => {
      setReprocessingId(id);
      try {
        await knowledgeApi.reprocess(id);
        message.success("Đang chạy lại embedding...");
        await fetchList();
      } catch (err) {
        message.error(err?.message || "Chạy lại embedding thất bại");
      } finally {
        setReprocessingId(null);
      }
    },
    [fetchList]
  );

  const columns = useMemo(() => {
    const cols = [
      {
        title: "Tên file",
        dataIndex: "originalName",
        key: "originalName",
        ellipsis: true,
      },
      {
        title: "Số hiệu",
        dataIndex: "documentCode",
        key: "documentCode",
        width: 140,
        ellipsis: true,
        render: (v) => v || "—",
      },
      {
        title: "HL từ",
        dataIndex: "effectiveDate",
        key: "effectiveDate",
        width: 110,
        render: (v) => v || "—",
      },
      {
        title: "Dung lượng",
        dataIndex: "size",
        key: "size",
        width: 110,
        render: (v) => formatSize(v),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 280,
        render: (status, row) => {
          const meta = statusMap[status] || { color: "default", text: status };
          return (
            <Space direction="vertical" size={0} style={{ maxWidth: 260 }}>
              <Tag color={meta.color}>{meta.text}</Tag>
              {status === "failed" && row.errorMessage ? (
                <Tooltip title={row.errorMessage}>
                  <Text type="danger" style={{ fontSize: 12 }} ellipsis>
                    {row.errorMessage}
                  </Text>
                </Tooltip>
              ) : null}
            </Space>
          );
        },
      },
      {
        title: "Số chunk",
        dataIndex: "chunkCount",
        key: "chunkCount",
        width: 100,
      },
      {
        title: "Embed tokens",
        dataIndex: "embeddingTokens",
        key: "embeddingTokens",
        width: 120,
        render: (v) =>
          v != null ? Number(v).toLocaleString("vi-VN") : "—",
      },
      {
        title: "Ngày tải",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 170,
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
      },
    ];

    if (canAdd || canDelete) {
      cols.push({
        title: "Thao tác",
        key: "action",
        width: 120,
        render: (_, row) => (
          <Space size="small">
            {canAdd && row.status === "failed" && (
              <Tooltip title="Chạy lại embedding">
                <Button
                  size="small"
                  icon={<RedoOutlined />}
                  loading={reprocessingId === row._id}
                  onClick={() => handleReprocess(row._id)}
                />
              </Tooltip>
            )}
            {canDelete && (
              <Popconfirm
                title="Xóa file này và toàn bộ chunk?"
                onConfirm={() => handleDelete(row._id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        ),
      });
    }

    return cols;
  }, [canAdd, canDelete, handleDelete, handleReprocess, reprocessingId]);

  return (
    <div className="p-3 md:p-4">
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Tài liệu kiến thức AI (Trợ lý ảo)
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Upload PDF chọn được chữ / DOCX / TXT. Khi văn bản nhà nước cập nhật: xóa hoặc thay bản hết hiệu lực rồi upload bản mới (hoặc bấm Thử lại sau khi đổi file).
                Hệ thống cắt theo Điều (nếu có), embedding. Trợ lý ưu tiên web (cập nhật), đối chiếu với tài liệu tại đây.
              </Paragraph>
            </div>
            <Button icon={<ReloadOutlined />} onClick={fetchList} loading={loading}>
              Làm mới
            </Button>
          </div>

          {canAdd && (
            <>
              <Space wrap style={{ width: "100%" }}>
                <Input
                  placeholder="Số hiệu (vd. 168/2024/NĐ-CP)"
                  value={documentCode}
                  onChange={(e) => setDocumentCode(e.target.value)}
                  style={{ width: 260 }}
                  allowClear
                />
                <Input
                  placeholder="Ngày hiệu lực (yyyy-mm-dd)"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  style={{ width: 200 }}
                  allowClear
                />
              </Space>
              <Dragger
                multiple={false}
                showUploadList={false}
                beforeUpload={handleUpload}
                disabled={uploading}
                accept=".pdf,.docx,.txt,application/pdf,text/plain"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {uploading ? "Đang upload..." : "Kéo thả hoặc bấm để chọn file"}
                </p>
                <p className="ant-upload-hint">
                  PDF (có lớp chữ), DOCX, TXT — tối đa 20MB. File lỗi / đổi chunk: bấm Thử lại.
                </p>
              </Dragger>
            </>
          )}

          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={items}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </Space>
      </Card>
    </div>
  );
}
