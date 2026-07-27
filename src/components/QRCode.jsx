import React, { useRef, useState } from 'react';
import QRCode from "react-qr-code";

const QRCodeComponent = ({ link, logoUrl = "/cong-an-hieu.png" }) => {
    const [name, setName] = useState('QRCode');
    const qrContainerRef = useRef();

    const downloadQRCode = () => {
        const svg = qrContainerRef.current.querySelector("svg");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // TĂNG ĐỘ PHÂN GIẢI (Scale lên 4 lần để nét căng)
        const scale = 4;
        const qrSize = 600 * scale; 
        const textHeight = 60 * scale;
        
        canvas.width = qrSize;
        canvas.height = qrSize + textHeight;

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const qrImg = new Image();
        const logoImg = new Image();

        qrImg.onload = () => {
            // Tắt chế độ làm mượt để các ô vuông QR sắc cạnh
            ctx.imageSmoothingEnabled = false;

            // 1. Nền trắng
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Vẽ QR Code
            ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

            // 3. Vẽ Chữ (Tăng size font tương ứng với scale)
            ctx.fillStyle = "#000000";
            ctx.font = `bold ${14 * scale}px Arial`; 
            ctx.textAlign = "center";
            ctx.fillText(name, canvas.width / 2, qrSize + (25 * scale));

            // 4. Vẽ Logo
            logoImg.crossOrigin = "anonymous"; 
            logoImg.onload = () => {
                const logoSize = qrSize * 0.2;
                const x = (qrSize - logoSize) / 2;
                const y = (qrSize - logoSize) / 2;

                // Nền trắng cho logo
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(x - (2 * scale), y - (2 * scale), logoSize + (4 * scale), logoSize + (4 * scale));

                ctx.drawImage(logoImg, x, y, logoSize, logoSize);

                // Xuất file chất lượng cao nhất (1.0)
                const pngFile = canvas.toDataURL("image/png", 1.0);
                const downloadLink = document.createElement("a");
                downloadLink.download = `${name || 'QRCode'}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
                URL.revokeObjectURL(url);
            };
            logoImg.src = logoUrl;
        };
        qrImg.src = url;
    };

    return (
        <div className='my-4 flex flex-col items-center w-max p-4 border rounded-xl bg-white shadow-lg'>
            <div ref={qrContainerRef} className="relative bg-white p-2">
                <QRCode
                    value={link || "https://google.com"}
                    size={250}
                    level="H"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded-sm shadow-sm">
                        <img src={logoUrl} alt="logo" className="w-10 h-10 object-contain" />
                    </div>
                </div>
            </div>

            <p className="mt-2 font-bold text-black text-[12px]">{name}</p>

            <input 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                className='w-full mt-4 outline-none border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500' 
                placeholder='Nhập tên file...' 
            />
            
            <button 
                onClick={downloadQRCode}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
                Tải mã QR 
            </button>
        </div>
    );
};

export default QRCodeComponent;