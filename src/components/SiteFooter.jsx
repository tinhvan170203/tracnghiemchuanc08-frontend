/**
 * Footer dùng chung (không logo).
 * - admin: xanh #1565c0 + trống đồng mờ + chữ trắng
 * - public: nền trống đồng vàng giống banner + chữ tối (đọc rõ trên mobile lẫn desktop)
 */
export default function SiteFooter({ variant = "public" }) {
  const isAdmin = variant === "admin";

  const shell = isAdmin
    ? "relative mx-2 mb-2 mt-4 overflow-hidden rounded-xl text-white shadow-md"
    : "relative mt-8 overflow-hidden shadow-md shadow-slate-400";

  return (
    <footer className={shell}>
      {isAdmin ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[#1565c0]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[url('/nentrongdong.png')] bg-cover bg-center opacity-[0.18]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[#1565c0]/55"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-center bg-cover bg-[url('/nentrongdong.png')]"
          aria-hidden
        />
      )}

      <div className="relative z-10 flex flex-col items-center px-4 py-3 sm:px-6 sm:py-3">
        {isAdmin ? (
          <>
            <p className="text-center text-[12px] font-bold uppercase tracking-wide text-white">
              {/* Bản quyền thuộc Công an tỉnh Hưng Yên */}
                  Cục Cảnh sát giao thông và Công an tỉnh Hưng Yên phối hợp thực hiện
            </p>
            <p className="text-center text-[13px] font-normal leading-relaxed text-white/90">
              Phần mềm tuyên truyền, đánh giá
              nhận thức, kiến thức pháp luật về trật tự, an toàn giao thông
            </p>
          </>
        ) : (
          <>
            <p className="text-center text-[12px] font-bold uppercase tracking-wide text-[#b20202] [text-shadow:_0_1px_0_rgba(255,255,255,0.55)]">
              {/* Bản quyền thuộc Công an tỉnh Hưng Yên */}
              Cục Cảnh sát giao thông và Công an tỉnh Hưng Yên phối hợp thực hiện
            </p>
            <p className="text-center text-[11px] font-semibold  text-[#b20202] [text-shadow:_0_1px_0_rgba(255,255,255,0.45)] sm:text-[13px]">
              Phần mềm tuyên truyền, đánh giá nhận thức, kiến thức pháp luật về
              trật tự, an toàn giao thông
            </p>
          </>
        )}
      </div>
    </footer>
  );
}
