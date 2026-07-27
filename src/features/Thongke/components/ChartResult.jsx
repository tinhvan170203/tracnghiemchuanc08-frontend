import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartResult = ({ text, dataKhongdat, dataTrungbinh, dataKha, dataGioi, dataXuatsac, total }) => {

  let arr = [];
  if (total !== 0) {
    arr = [(dataKhongdat / total * 100).toFixed(2),(dataTrungbinh / total * 100).toFixed(2), 
     (dataKha / total * 100).toFixed(2),(dataGioi / total * 100).toFixed(2), (dataXuatsac / total * 100).toFixed(2)]
  };

  return <Doughnut data={
    {
      labels: ['Không đạt', 'Trung bình', 'Khá', 'Giỏi', 'Xuất sắc'],
      datasets: [
        {
          label: 'Chiếm % tỉ lệ',
          data: arr,
          backgroundColor: [
            'rgba(255, 0, 0, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderColor: [
            'rgba(255, 0, 0, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }

    options={{
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text,
        },
      },
    }} />;
};

export default ChartResult
