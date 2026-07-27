import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { API_SERVER } from '../api/apiServer';

function VideoViewer({ video }) {
  const [url, setUrl] = useState(null);

  useEffect(()=>{
    if(video){
      let checkLink = video.is_source_link_orther ? video.link_orther : `${API_SERVER}public/${video.link}`
      setUrl(checkLink)
    }
  },[video]);


  return (
    <div className="player-wrapper" style={{ position: 'relative', paddingTop: '56.25%' /* Tỷ lệ 16:9 */ }}>
      <ReactPlayer
        src={`${url}`}
        controls={true} // Hiện thanh điều khiển (play/pause, volume, seek bar)
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        playing={false}
        muted={false}
        playsInline
        pip
        light={false}
        fallback={<div>Đang tải...</div>}
      // Các thuộc tính phụ nếu cần:
      // playing={true} // Tự động phát
      // volume={0.8}   // Âm lượng mặc định từ 0 đến 1
      // onEnded={() => console.log('Đã xem xong video!')}
      />
    </div>
  );
}

export default VideoViewer;