import React, { useCallback, useEffect, useState } from "react";
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
} from "antd";
import { InboxOutlined, ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import knowledgeApi from "../../api/knowledgeApi";
import "antd/dist/reset.css";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleDelete = async (id) => {
    try {
      await knowledgeApi.remove(id);
      message.success("Đã xóa file");
      fetchList();
    } catch (err) {
      message.error(err?.message || "Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "Tên file",
      dataIndex: "originalName",
      key: "originalName",
      ellipsis: true,
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
      width: 130,
      render: (status, row) => {
        const meta = statusMap[status] || { color: "default", text: status };
        return (
          <Tag color={meta.color} title={row.errorMessage || ""}>
            {meta.text}
          </Tag>
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
      title: "Ngày tải",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, row) => (
        <Popconfirm
          title="Xóa file này và toàn bộ chunk?"
          onConfirm={() => handleDelete(row._id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

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
                Upload PDF / DOCX / TXT. Hệ thống tách chunk, tạo embedding và ưu tiên trả lời từ
                các file này; không đủ mới tìm trên web.
              </Paragraph>
            </div>
            <Button icon={<ReloadOutlined />} onClick={fetchList} loading={loading}>
              Làm mới
            </Button>
          </div>

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
            <p className="ant-upload-hint">PDF, DOCX, TXT — tối đa 20MB</p>
          </Dragger>

          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={items}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Space>
      </Card>
    </div>
  );
}
