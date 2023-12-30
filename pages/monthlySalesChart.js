import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { register as registerTimeScale } from 'chart.js/scales';

// Register the time scale adapter
registerTimeScale('time', require('chartjs-adapter-date-fns'));

const MonthlySalesChart = ({ salesData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (salesData) {
      // Extract data for labels, total order quantity, and total sales
      const labels = salesData.map((item) => `${item._id.year}-${item._id.month}-${item._id.day}`);
      const totalOrderQuantity = salesData.map((item) => item.totalOrders);
      const totalSales = salesData.map((item) => item.totalSales);

      // Create the chart data object
      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Total Order Quantity',
            data: totalOrderQuantity,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y-axis-1',
          },
          {
            label: 'Total Sales',
            data: totalSales,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y-axis-2',
          },
        ],
      };

      setChartData(data);
    }
  }, [salesData]);

  return (
    <div style={{ marginTop: '20px' }}>
      {chartData && (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                },
              },
              y: [
                {
                  type: 'linear',
                  position: 'left',
                  id: 'y-axis-1',
                },
                {
                  type: 'linear',
                  position: 'right',
                  id: 'y-axis-2',
                },
              ],
            },
          }}
        />
      )}
    </div>
  );
};

export default MonthlySalesChart;
