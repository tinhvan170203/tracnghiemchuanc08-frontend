import React, { useEffect, useState } from "react";
import { HelpCircle, ArrowRight } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import learningApi from "../../api/learningApi";
import { Button } from "@mui/material";
import { HEADER_1, HEADER_2 } from "../../../constant/constant";
import PageSectionHeader from "../../components/PageSectionHeader";
import {
  CardGlowCircles,
  TEST_GRADIENTS,
  gradientCardClass,
} from "../../components/CardGlowCircles";

const DetailKiemTra = () => {
  const [list, setList] = useState([]);
  const [monthi, setMonthi] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { id_monthi } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        setErrorMsg("");
        const res = await learningApi.getChuyendesOfMonthi(id_monthi);
        const chuyendes = (res.data.chuyendes || []).filter((i) => !!i.link_test);
        setList(chuyendes);
        setMonthi(res.data.monthi);
      } catch (error) {
        setErrorMsg(
          error.message || "Không tải được danh sách chuyên đề kiểm tra"
        );
        setList([]);
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
        tone="emerald"
        title="Kiểm tra — chọn chuyên đề để làm bài"
        subtitle={monthi?.tenmonthi}
      />

      {errorMsg && (
        <p className="text-center text-red-600 font-semibold my-8 px-3">
          {errorMsg}
        </p>
      )}

      <div className="flex flex-col md:flex-row md:flex-wrap">
        {list.map((item, index) => (
          <div key={item._id} className="w-full md:basis-1/4 px-2 my-3">
            <div
              className={gradientCardClass(
                TEST_GRADIENTS[index % TEST_GRADIENTS.length]
              )}
            >
              <CardGlowCircles />

              <div className="relative z-10 flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 rounded-xl bg-white/25 p-2 ring-1 ring-white/40 backdrop-blur-sm">
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
                <div className="inline-flex w-fit items-center space-x-3 rounded-xl bg-white/20 p-3 ring-1 ring-white/30 backdrop-blur-sm">
                  <div className="rounded-lg bg-white/25 p-2 text-white">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-white/80">
                      Câu hỏi
                    </p>
                    <p className="text-[18px] font-bold text-white">
                      {item.soCauHoi}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-end">
                <NavLink to={`/tu-kiem-tra/${item.link_test}`}>
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
                    Vào kiểm tra
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!errorMsg && list.length === 0 && (
        <p className="text-center text-gray-500 px-4 py-6">
          Chưa có chuyên đề nào gắn bài kiểm tra (link_test).
        </p>
      )}
    </div>
  );
};

export default DetailKiemTra;
