/**
 * Tiêu đề trang — phẳng, góc nhẹ, không panel “AI”.
 */
export default function PageSectionHeader({
  title,
  subtitle,
  tone = "amber",
}) {
  const accent = tone === "emerald" ? "bg-[#0d7a5f]" : "bg-[#c45c12]";
  const crumb = tone === "emerald" ? "text-[#0d7a5f]" : "text-[#c45c12]";

  return (
    <div className="mx-3 mb-4 mt-3 border-b border-slate-200 pb-3">
      <div className="flex gap-3">
        <div className={`mt-1 h-10 w-[3px] flex-shrink-0 ${accent}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <img
              src="/logoc08.png"
              alt=""
              className="h-9 w-9 flex-shrink-0 object-contain"
            />
            <h1 className="text-[15px] font-semibold leading-snug text-slate-800 sm:text-[16px]">
              {title}
            </h1>
          </div>
          {subtitle ? (
            <p className={`mt-1.5 pl-[46px] text-[13px] font-medium ${crumb}`}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
