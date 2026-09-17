import React, { useEffect, useState } from "react";
import learningApi from "../../api/learningApi";
import { BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";
import SiteFooter from "../../components/SiteFooter";
import PageSectionHeader from "../../components/PageSectionHeader";
import {
  CardGlowCircles,
  LEARN_GRADIENTS,
  gradientCardClass,
} from "../../components/CardGlowCircles";

const Learning = () => {
  const [list, setList] = useState([]);
  const [choPhepHoc, setChoPhepHoc] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dashRes, settingsRes] = await Promise.all([
          learningApi.getDashboard(),
          learningApi.getSettings(),
        ]);
        setList(dashRes.data);
        setChoPhepHoc(!!settingsRes.data.cho_phep_hoc_cauhoi);
      } catch (error) {
        alert(error.message);
      }
    };
    fetch();
  }, []);

  return (
    <div>
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

      <PageSectionHeader
        tone="amber"
        title="Tự học — ôn tập kiến thức pháp luật về TTATGT"
      />

      <div className="flex flex-col md:flex-row md:flex-wrap">
        {list.map((item, index) => (
          <div key={item._id} className="w-full md:basis-1/4 px-2 my-3">
            <div
              className={gradientCardClass(
                LEARN_GRADIENTS[index % LEARN_GRADIENTS.length]
              )}
            >
              <CardGlowCircles />

              <div className="relative z-10 flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 rounded-xl bg-white/25 p-2 ring-1 ring-white/40 backdrop-blur-sm transition-transform group-hover:scale-105">
                  <img
                    src="/cong-an-hieu.png"
                    alt="Công an hiệu"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <h3 className="text-[13px] font-bold text-white line-clamp-2 drop-shadow-sm">
                  {item.tenmonthi}
                </h3>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-3 rounded-xl bg-white/20 p-3 ring-1 ring-white/30 backdrop-blur-sm">
                  <div className="rounded-lg bg-white/25 p-2 text-white">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-white/80">
                      Chuyên đề
                    </p>
                    <p className="text-[18px] font-bold text-white">
                      {item.soChuyenDe}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 rounded-xl bg-white/20 p-3 ring-1 ring-white/30 backdrop-blur-sm">
                  <div className="rounded-lg bg-white/25 p-2 text-white">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-end">
                {choPhepHoc ? (
                  <NavLink
                    to={`/${item._id}/chuyendes`}
                    className="inline-flex items-center rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white no-underline ring-1 ring-white/30 backdrop-blur-sm transition-transform group-hover:translate-x-0.5"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </NavLink>
                ) : (
                  <span className="text-xs font-medium text-white/85">
                    Tạm đóng học câu hỏi
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-center text-gray-500 px-4 py-6">
          Chưa có nội dung tự học được hiển thị.
        </p>
      )}
      <SiteFooter />
    </div>
  );
};

export default Learning;
