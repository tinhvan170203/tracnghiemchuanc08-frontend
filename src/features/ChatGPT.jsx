import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_SERVER } from '../api/apiServer';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const API_URL = `${API_SERVER}api/chat-gpt`; // Đảm bảo Backend Express của bạn đang chạy port này
const STORAGE_KEY = 'traffic_chat_history_gpt';

function ChatGPT() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Xin chào! Tôi là Trợ lý ảo cảnh sát giao thông. Rất sẵn lòng trợ giúp, trả lời các câu hỏi của bạn liên quan đến các kiến thức về an toàn giao thông!' }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    // OpenAI cần lịch sử chat sạch sẽ, ta lưu vào state để hiển thị
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Gửi request lên Backend Express (nơi chứa API Key OpenAI)
      const response = await axios.post(API_URL, {
        history: newMessages
      });

      // OpenAI thường trả về { reply: "nội dung" } từ Express
      const aiReply = { role: 'assistant', content: response.data.reply };
      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error('Lỗi gọi API ChatGPT:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '⚠️ Rất tiếc, tôi không thể kết nối với máy chủ AI lúc này. Vui lòng kiểm tra lại kết nối!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Bạn có muốn xóa toàn bộ lịch sử trò chuyện?")) {
      setMessages([{ role: 'assistant', content: 'Lịch sử đã được làm mới. Tôi có thể giúp gì cho bạn?' }]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 className='text-md flex items-center'>
            <img src='/AIgiaothong.png' className='w-12 md:w-[100px] text-[10px] md:text-sm' />
            Trợ lý ảo cảnh sát giao thông
          </h1>
          {/* <span className='text-[12px]  font-semibold text-green-600'>Cục C08 - Bộ Công an</span> */}
        </div>
        <div>
          <IconButton onClick={clearChat} title='Xóa lịch sử'>
            <CloseIcon style={{ fontSize: "16px" }} />
          </IconButton>
          <IconButton onClick={() => navigate(-1)} title='Quay lại'>
            <KeyboardReturnIcon style={{ fontSize: "16px" }} />
          </IconButton>
          {/* <button onClick={clearChat} title='Xóa lịch sử' ><CloseIcon style={{fontSize: "16px"}}/></button>  */}
          {/* <button onClick={()=>navigate(-1)} style={styles.clearBtn} className='hover:!bg-blue-500 hover:!text-white'>Quay lại</button> */}
        </div>
      </header>

      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            ...styles.messageRow,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              ...styles.messageBubble,
              backgroundColor: msg.role === 'user' ? '#007bff' : '#f4f4f9',
              color: msg.role === 'user' ? '#fff' : '#333',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={styles.loading}>
            <span className="dot-flashing"></span> Đang trả lời...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ví dụ: Lỗi nồng độ cồn xe máy phạt bao nhiêu?..."
          style={styles.input}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          style={{ ...styles.sendBtn, opacity: isLoading ? 0.6 : 1 }}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Gửi'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '10px auto', height: '95vh', display: 'flex', flexDirection: 'column', border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', fontFamily: '"Segoe UI", Roboto, sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  header: { padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: '20px', color: '#1a1a1a', fontWeight: 'bold' },
  status: { fontSize: '12px', color: '#28a745' },
  clearBtn: { padding: '8px 15px', border: 'none', color: '#666', backgroundColor: '#f0f0f0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  chatWindow: { flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#fdfdfd' },
  messageRow: { display: 'flex', marginBottom: '20px' },
  messageBubble: { padding: '12px 18px', borderRadius: '18px', maxWidth: '80%', lineHeight: '1.5', fontSize: '15px' },
  loading: { paddingLeft: '20px', color: '#888', fontSize: '13px', marginBottom: '20px' },
  inputArea: { padding: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '12px', backgroundColor: '#fff' },
  input: { flex: 1, padding: '15px', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '15px', outline: 'none', transition: 'border 0.3s' },
  sendBtn: { padding: '0 25px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' },
};

export default ChatGPT;