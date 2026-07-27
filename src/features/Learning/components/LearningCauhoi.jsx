import { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    RotateCcw,
    Sparkles,
    Award,
    HelpCircle
} from 'lucide-react';
import {
    markAsLearned,
    getResumeIndex,
    isDoneAll,
    resetProgress,
} from './utils';
import learningApi from '../../../api/learningApi';
import { API_SERVER } from '../../../api/apiServer';

export default function LearningCauhoi() {
    const { chuyendeId } = useParams();
    const navigate = useNavigate(); // Dùng nếu muốn thêm nút quay lại danh sách

    const [chuyende, setChuyende] = useState("");
    const [monthiId, setMonthiId] = useState("");
    const [cauhois, setCauhois] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await learningApi.getCauhoisOfChuyende(chuyendeId);
                const data = res.data;

                setCauhois(data.cauhois || []);
                setMonthiId(data.monthiId);
                setChuyende(data.chuyende.title);
                setFinished(isDoneAll(chuyendeId, data.cauhois || []));
                setCurrentIndex(getResumeIndex(chuyendeId, data.cauhois || []));
            } catch (error) {
                console.error("Lỗi khi tải câu hỏi:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [chuyendeId]);

    const current = cauhois[currentIndex];
    const progressPercent = cauhois.length > 0
        ? Math.round(((currentIndex + (finished ? 1 : 0)) / cauhois.length) * 100)
        : 0;

    const handleNext = () => {
        if (current) markAsLearned(chuyendeId, current._id);
        setShowAnswer(false);

        if (currentIndex === cauhois.length - 1) {
            setFinished(true);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    };

    const handlePrev = () => {
        setShowAnswer(false);
        setCurrentIndex((i) => Math.max(i - 1, 0));
    };

    const handleRestart = () => {
        resetProgress(chuyendeId);
        setCurrentIndex(0);
        setFinished(false);
        setShowAnswer(false);
    };

    // 1. Màn hình Loading
    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="relative flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
                    <BookOpen className="h-6 w-6 text-orange-500 absolute" />
                </div>
                <p className="mt-4 text-slate-600 font-medium animate-pulse">Đang tải câu hỏi...</p>
            </div>
        );
    }

    // 2. Màn hình Trống (Không có câu hỏi)
    if (cauhois.length === 0) {
        return (
            <>
                <div className="shadow-md shadow-slate-400 mb-4 md:h-auto bg-center py-2 bg-cover  bg-[url('/nentrongdong.png')] z-10 flex justify-center">
                    <div className="">
                        <div className="flex items-center justify-center" >
                            <img src="/cong-an-hieu.png" className="md:w-24 w-12" />
                            <img src="/logoc08.png" className="md:w-[64px] w-8" />
                        </div>
                        <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
                            Bộ Công an
                        </h3>
                        <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
                            Cục cảnh sát giao thông
                        </h3>
                    </div>
                </div>
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-4 bg-orange-100 rounded-full text-orange-500 mb-4">
                        <HelpCircle className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có câu hỏi nào</h3>
                    <p className="text-gray-500 max-w-sm">Chuyên đề này hiện chưa được cập nhật nội dung câu hỏi. Vui lòng quay lại sau.</p>
                </div>
                <NavLink to={`/${monthiId}/chuyendes`}>
                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-2 justify-center">
                        <button
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 shadow-lg hover:bg-orange-50 transition-all active:scale-95"
                        >
                            <RotateCcw className="h-4 w-4" /> Lựa chọn chuyên đề khác
                        </button>
                    </div>
                </NavLink>
            </>
        );
    }

    // 3. Màn hình Hoàn thành bài học
    if (finished) {
        return (
            <>
                <div className="shadow-md shadow-slate-400 mb-4 md:h-auto bg-center py-2 bg-cover  bg-[url('/nentrongdong.png')] z-10 flex justify-center">
                    <div className="">
                        <div className="flex items-center justify-center" >
                            <img src="/cong-an-hieu.png" className="md:w-24 w-12" />
                            <img src="/logoc08.png" className="md:w-[64px] w-8" />
                        </div>
                        <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
                            Bộ Công an
                        </h3>
                        <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
                            Cục cảnh sát giao thông
                        </h3>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto my-8 px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 text-center text-white shadow-2xl shadow-orange-500/30">
                        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/20 p-4 backdrop-blur-md border border-white/30 animate-bounce">
                                <Award className="h-8 w-8 text-amber-200" />
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2">
                                <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Hoàn thành xuất sắc
                            </span>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                                Chúc mừng bạn!
                            </h2>
                            <p className="text-orange-100 text-sm sm:text-base max-w-md mb-8">
                                Bạn đã học xong toàn bộ <span className="font-bold text-white">{cauhois.length}</span> câu hỏi thuộc chuyên đề này.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                                <button
                                    onClick={handleRestart}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 shadow-lg hover:bg-orange-50 transition-all active:scale-95"
                                >
                                    <RotateCcw className="h-4 w-4" /> Học lại từ đầu
                                </button>
                            </div>

                            <NavLink to={`/${monthiId}/chuyendes`}>
                                <div className="flex flex-col sm:flex-row gap-3 w-full mt-2 justify-center">
                                    <button
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 shadow-lg hover:bg-orange-50 transition-all active:scale-95"
                                    >
                                        <RotateCcw className="h-4 w-4" /> Lựa chọn chuyên đề khác
                                    </button>
                                </div>
                            </NavLink>

                        </div>
                    </div>
                </div>
            </>
        );
    }

    // 4. Màn hình Học câu hỏi chính
    return (
        <>
            <div className="shadow-md shadow-slate-400 mb-4 md:h-auto bg-center py-2 bg-cover  bg-[url('/nentrongdong.png')] z-10 flex justify-center">
                <div className="">
                    <div className="flex items-center justify-center" >
                        <img src="/cong-an-hieu.png" className="md:w-24 w-12" />
                        <img src="/logoc08.png" className="md:w-[64px] w-8" />
                    </div>

                    <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
                        Bộ Công an
                    </h3>
                    <h3 className="text-center text-[11px] md:text-lg md:text-white uppercase text-[#ffee00] drop-shadow [text-shadow:_1px_1px_4px_black] font-bold">
                        Cục cảnh sát giao thông
                    </h3>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Header: Thanh tiến trình */}
                <div className="mb-6 bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" /> Đang học {chuyende}
                        </span>
                        <span className="text-[12px] font-bold text-gray-700">
                            Câu <span className="text-orange-600">{currentIndex + 1}</span> / {cauhois.length}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${((currentIndex + 1) / cauhois.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Card Nội dung câu hỏi */}
                <div className="relative rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-orange-500/5 border border-orange-200/60 mb-6 transition-all">
                    {/* Viền màu cam trang trí top card */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-t-3xl" />

                    {/* Nội dung câu hỏi */}
                    <div className="mt-2">
                        <h3 className="text-[14px] font-bold text-gray-800 leading-relaxed mb-4">
                            {current?.question}
                        </h3>

                        {/* Hình ảnh đính kèm (nếu có) */}
                        {current?.image && (
                            <div className="my-4 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/30 p-2">
                                <img
                                    src={`${API_SERVER}c08/uploads/${current.image}`}
                                    alt="Hình ảnh câu hỏi"
                                    className="max-h-80 w-full object-contain rounded-xl mx-auto"
                                />
                            </div>
                        )}
                    </div>

                    {/* Khung hiển thị đáp án */}

                    <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 animate-fadeIn">
                        <div className="flex items-center gap-2 mb-1 text-emerald-700  text-xs uppercase tracking-wider">
                            <CheckCircle2 className="h-4 w-4" /> Nội dung câu trả lời:
                        </div>
                        <p className="text-[14px] font-semibold text-emerald-800 pl-6">
                            {current?.answerText}
                        </p>
                    </div>


                </div>

                {/* Điều hướng Câu trước / Câu tiếp */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                    >
                        <ChevronLeft className="h-5 w-5" /> Câu trước
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:opacity-95 active:scale-95"
                    >
                        {currentIndex === cauhois.length - 1 ? (
                            <>
                                Hoàn thành <CheckCircle2 className="h-5 w-5" />
                            </>
                        ) : (
                            <>
                                Câu tiếp theo <ChevronRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}