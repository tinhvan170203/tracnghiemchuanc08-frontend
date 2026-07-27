import { useEffect } from 'react';

const AppUpdater = () => {
  useEffect(() => {
    const handleError = (e) => {
      // 1. Bắt lỗi từ các thẻ script/link (lỗi mạng hoặc file không tồn tại)
      // 2. Bắt lỗi nội dung file không đúng định dạng (MIME type error)
      const errorMessages = [
        "Importing a module script failed",
        "Failed to fetch dynamically imported module",
        "content type",
        "MIME"
      ];

      const isChunkError = errorMessages.some(msg => 
        (e.message && e.message.includes(msg)) || 
        (e.reason && e.reason.message && e.reason.message.includes(msg))
      );

      if (isChunkError) {
        // Tránh loop liên tục: chỉ reload nếu lần cuối cách đây 10s
        const lastReload = sessionStorage.getItem('last-reload');
        const now = Date.now();
        
        if (!lastReload || now - parseInt(lastReload) > 10000) {
          sessionStorage.setItem('last-reload', now.toString());
          window.location.reload();
        }
      }
    };

    // Lắng nghe lỗi thông thường
    window.addEventListener('error', handleError, true);
    // Lắng nghe lỗi từ các Promise (quan trọng cho React.lazy)
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  return null;
};

export default AppUpdater;