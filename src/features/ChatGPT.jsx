import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import SendIcon from "@mui/icons-material/Send";
import { API_SERVER } from "../api/apiServer";

const API_URL = `${API_SERVER}api/chat-gpt`;
const STORAGE_KEY = "traffic_chat_history_gpt";

const sourceLabel = {
  file: { label: "Từ tài liệu", color: "success" },
  web: { label: "Từ web", color: "warning" },
  mixed: { label: "Tài liệu + web", color: "info" },
};

function ChatGPT() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content:
              "Xin chào! Tôi là Trợ lý ảo cảnh sát giao thông. Rất sẵn lòng trợ giúp, trả lời các câu hỏi của bạn liên quan đến các kiến thức về an toàn giao thông!",
          },
        ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = newMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map(({ role, content }) => ({ role, content }));

      const response = await axios.post(API_URL, { history: historyForApi });
      const { reply, sourceType, sources } = response.data || {};
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "Không nhận được phản hồi từ trợ lý.",
          sourceType: sourceType || null,
          sources: sources || [],
        },
      ]);
    } catch (error) {
      console.error("Lỗi gọi API ChatGPT:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Rất tiếc, tôi không thể kết nối với máy chủ AI lúc này. Vui lòng kiểm tra lại kết nối!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Bạn có muốn xóa toàn bộ lịch sử trò chuyện?")) {
      setMessages([
        {
          role: "assistant",
          content: "Lịch sử đã được làm mới. Tôi có thể giúp gì cho bạn?",
        },
      ]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        my: 1,
        height: "95vh",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #eee",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        bgcolor: "#fff",
      }}
    >
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src="/AIgiaothong.png"
              alt="AI"
              sx={{ width: { xs: 48, md: 80 } }}
            />
            <Typography variant="subtitle1" fontWeight={700}>
              Trợ lý ảo cảnh sát giao thông
            </Typography>
          </Stack>
          <Box>
            <IconButton onClick={clearChat} title="Xóa lịch sử" size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => navigate(-1)} title="Quay lại" size="small">
              <KeyboardReturnIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#fdfdfd" }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                px: 2,
                borderRadius: 3,
                maxWidth: "80%",
                bgcolor: msg.role === "user" ? "#007bff" : "#f4f4f9",
                color: msg.role === "user" ? "#fff" : "#333",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              {msg.sourceType && sourceLabel[msg.sourceType] && (
                <Chip
                  size="small"
                  label={sourceLabel[msg.sourceType].label}
                  color={sourceLabel[msg.sourceType].color}
                  sx={{ mb: 1 }}
                />
              )}
              {String(msg.content || "")
                .split("\n")
                .map((line, i) => (
                  <Typography key={i} variant="body2" sx={{ mb: 0.5, whiteSpace: "pre-wrap" }}>
                    {line}
                  </Typography>
                ))}
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "#888", mb: 2, pl: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption">Đang trả lời...</Typography>
          </Stack>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          gap: 1.5,
          bgcolor: "#fff",
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ví dụ: Lỗi nồng độ cồn xe máy phạt bao nhiêu?..."
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isLoading}
          endIcon={<SendIcon />}
          sx={{ minWidth: 100, borderRadius: 2 }}
        >
          Gửi
        </Button>
      </Box>
    </Box>
  );
}

export default ChatGPT;
