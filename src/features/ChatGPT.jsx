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
  CircularProgress,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import SendIcon from "@mui/icons-material/Send";
import { API_SERVER } from "../api/apiServer";

const API_URL = `${API_SERVER}api/chat-gpt`;
const STORAGE_KEY = "traffic_chat_history_gpt";

const WELCOME_MSG =
  "Xin chào! Tôi là Trợ lý ảo cảnh sát giao thông.";

function ChatGPT() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [{ role: "assistant", content: WELCOME_MSG }];
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

      const response = await axios.post(API_URL, {
        history: historyForApi,
        origin: window.location.origin,
        hostname: window.location.hostname,
      });
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
          content: "Có lỗi xảy ra. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Bạn có muốn xóa toàn bộ lịch sử trò chuyện?")) {
      setMessages([{ role: "assistant", content: WELCOME_MSG }]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        px: { xs: 1, sm: 2 },
        py: { xs: 1, sm: 2 },
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #eee",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          bgcolor: "#fff",
          minHeight: { xs: "calc(100dvh - 16px)", sm: "calc(100dvh - 32px)" },
        }}
      >
        <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
          <Toolbar sx={{ justifyContent: "space-between", gap: 1, minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
              <Box
                component="img"
                src="/AIgiaothong.png"
                alt="AI"
                sx={{ width: { xs: 40, sm: 56, md: 72 }, flexShrink: 0 }}
              />
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.95rem", md: "1rem" },
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                Trợ lý ảo cảnh sát giao thông
              </Typography>
            </Stack>
            <Box sx={{ flexShrink: 0 }}>
              <IconButton onClick={clearChat} title="Xóa lịch sử" size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => navigate(-1)} title="Quay lại" size="small">
                <KeyboardReturnIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2 }, overflowY: "auto", bgcolor: "#fdfdfd", WebkitOverflowScrolling: "touch" }}>
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
                  maxWidth: { xs: "92%", sm: "80%" },
                  bgcolor: msg.role === "user" ? "#007bff" : "#f4f4f9",
                  color: msg.role === "user" ? "#fff" : "#333",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  wordBreak: "break-word",
                }}
              >
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
            p: { xs: 1.5, sm: 2 },
            pb: { xs: "max(12px, env(safe-area-inset-bottom))", sm: 2 },
            borderTop: "1px solid #eee",
            bgcolor: "#fff",
          }}
        >
          <Stack direction={isMobile ? "column" : "row"} spacing={1.5}>
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
              sx={{
                minWidth: { xs: "100%", sm: 100 },
                minHeight: 44,
                borderRadius: 2,
                flexShrink: 0,
              }}
            >
              Gửi
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatGPT;
