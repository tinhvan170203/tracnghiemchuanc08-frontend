import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ClipboardCheck, FileText, PlayCircle } from "lucide-react";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";
import SiteFooter from "../../components/SiteFooter";
import { CardGlowCircles } from "../../components/CardGlowCircles";

const CARDS = [
  {
    to: "/hoc-tap",
    title: "Tự học kiến thức ATGT",
    desc: "Ôn tập kiến thức về trật tự ATGT",
    gradient: "from-amber-400 via-orange-400 to-amber-600",
    shadow: "shadow-amber-300/50 hover:shadow-amber-400/60",
    Icon: BookOpen,
  },
  {
    to: "/kiem-tra",
    title: "Kiểm tra kiến thức ATGT",
    desc: "Tự đánh giá, kiểm tra kiến thức ATGT",
    gradient: "from-emerald-400 via-teal-500 to-emerald-700",
    shadow: "shadow-emerald-300/50 hover:shadow-emerald-400/60",
    Icon: ClipboardCheck,
  },
  {
    to: "/video-tuyen-truyen",
    title: "Video tuyên truyền",
    desc: "Xem video tuyên truyền an toàn giao thông",
    gradient: "from-orange-400 via-orange-500 to-red-600",
    shadow: "shadow-orange-300/50 hover:shadow-orange-400/60",
    Icon: PlayCircle,
  },
  {
    to: "/cam-nang-an-toan-giao-thong",
    title: "Cẩm nang ATGT",
    desc: "Tài liệu, cẩm nang an toàn giao thông",
    gradient: "from-rose-400 via-red-500 to-red-700",
    shadow: "shadow-rose-300/50 hover:shadow-rose-400/60",
    Icon: FileText,
  },
  {
    to: "/hoi-dap-voi-tro-ly-ao",
    title: "Hỏi đáp trợ lý ảo",
    desc: "Hỏi đáp với trợ lý ảo giao thông",
    gradient: "from-sky-400 via-cyan-500 to-blue-700",
    shadow: "shadow-sky-300/50 hover:shadow-sky-400/60",
    image: "/AIgiaothong.png",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-orange-50/80">
      <div className="shadow-md shadow-slate-400 mb-4 md:h-auto bg-center py-2 bg-cover bg-[url('/nentrongdong.png')] z-10 flex justify-center">
        <div>
          <div className="flex items-center justify-center">
            <img src="/cong-an-hieu.png" className="md:w-24 w-12" alt="" />
            <img src="/logoc08.png" className="md:w-[64px] w-8" alt="" />
          </div>
          <h3 className="text-center text-[11px] md:text-lg uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
            {HEADER_1}
          </h3>
          <h3 className="text-center text-[11px] md:text-lg uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
            {HEADER_2}
          </h3>
        </div>
      </div>

      <div className="mt-4 mx-auto px-3 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => {
          const Icon = card.Icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className={`home-card group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 shadow-lg ${card.shadow} no-underline text-white min-h-[180px] flex flex-col transition-all duration-300 hover:-translate-y-1 hover:brightness-105`}
            >
              <CardGlowCircles />

              {card.image ? (
                <div className="relative z-10 mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white/25 p-2 backdrop-blur-sm ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={card.image}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="relative z-10 mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-white/25 text-white backdrop-blur-sm ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-105">
                  {Icon && <Icon className="h-9 w-9" strokeWidth={2.25} />}
                </div>
              )}

              <h2 className="relative z-10 text-[15px] font-bold tracking-tight text-white drop-shadow-sm">
                {card.title}
              </h2>
              <p className="relative z-10 mt-1 flex-1 text-sm font-medium text-white/90">
                {card.desc}
              </p>
              <div className="relative z-10 mt-3 inline-flex w-fit items-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm">
                <span>Vào ngay</span>
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      <SiteFooter />
    </div>
  );
}

export default Home;
