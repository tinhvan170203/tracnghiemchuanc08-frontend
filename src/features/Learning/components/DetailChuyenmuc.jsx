import React, { useEffect, useState } from "react";
import { HelpCircle, ArrowRight } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import learningApi from "../../../api/learningApi";
import { Button } from "@mui/material";
import { getLearnedIds } from "./utils";
import { HEADER_1, HEADER_2 } from "../../../../constant/constant";
import PageSectionHeader from "../../../components/PageSectionHeader";
import {
  CardGlowCircles,
  LEARN_GRADIENTS,
  gradientCardClass,
} from "../../../components/CardGlowCircles";

const getProgressPercent = (chuyendeId, soCauHoi) => {
  if (!soCauHoi) return 0;
  const learnedIds = getLearnedIds(chuyendeId);
  const learnedCount = Math.min(learnedIds.length, soCauHoi);
  return Math.round((learnedCount / soCauHoi) * 100);
};

const DetailChuyenmuc = () => {
  const [list, setList] = useState([]);
  const [monthi, setMonthi] = useState(null);
  const [lockedMsg, setLockedMsg] = useState("");
  const { id_monthi } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLockedMsg("");
        const res = await learningApi.getChuyendesOfMonthi(id_monthi);
        setList(res.data.chuyendes);
        setMonthi(res.data.monthi);
      } catch (error) {
        if (error.code === "HOC_CLOSED") {
          setLockedMsg(error.message);
          setList([]);
          return;
        }
        alert(error.message);
      }
    };
    fetch();
  }, [id_monthi]);

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
        title="Tự học — chọn chuyên đề để ôn tập"
        subtitle={monthi?.tenmonthi}
      />

      {lockedMsg && (
        <p className="text-center text-red-600 font-semibold my-8 px-3">
          {lockedMsg}
        </p>
      )}

      <div className="flex flex-col md:flex-row md:flex-wrap">
        {list.map((item, index) => {
          const percent = getProgressPercent(item._id, item.soCauHoi);
          return (
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
                    {item.title}
                  </h3>
                </div>

                <div className="relative z-10 mb-4">
                  <div className="inline-flex items-center space-x-3 rounded-xl bg-white/20 p-3 ring-1 ring-white/30 backdrop-blur-sm">
                    <div className="rounded-lg bg-white/25 p-2 text-white">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mb-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/90">
                      Tiến độ học tập
                    </span>
                    <span className="text-xs font-bold text-white">
                      {percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-white to-emerald-300 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-end">
                  <NavLink to={`/chuyendes/${item._id}/cauhois`}>
                    <Button
                      startIcon={<ArrowRight size={18} />}
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        boxShadow: "none",
                        border: "1px solid rgba(255,255,255,0.4)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
                      }}
                    >
                      {percent === 100
                        ? "Học lại"
                        : percent > 0
                          ? "Học tiếp"
                          : "Vào học"}
                    </Button>
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailChuyenmuc;
