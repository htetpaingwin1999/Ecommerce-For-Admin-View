import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import DataTable from 'react-data-table-component';
import { format, getDaysInMonth } from 'date-fns'; // Import date-fns for date formatting and getting days in a month
import { Chart } from 'react-google-charts'; // Import Google Charts

function MonthlySaleReport() {
  const [monthlySales, setMonthlySales] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  function fetchMonthlySales() {
    if (!selectedYear || !selectedMonth) {
      return; // Do not make the request if year or month is not selected
    }

    axios
      .get(`/api/monthly-sales?year=${selectedYear}&month=${selectedMonth}&status=3`) // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        setMonthlySales(response.data);
      })
      .catch((error) => {
        console.error('Error fetching monthly sales:', error);
      });
  }

  // Define columns for the table
  const columns = [
    {
      name: 'Date',
      selector: (row) => {
        const { year, month, day } = row._id;
        return `${year}-${month}-${day}`;
      },
      sortable: true,
    },
    {
      name: 'Total Order Quantity',
      selector: 'totalOrders',
      sortable: true,
    },
    {
      name: 'Total Sales',
      selector: 'totalSales',
      sortable: true,
    },
  ];  

  const handleSearch = () => {
    fetchMonthlySales(); // Fetch data when the search button is clicked
  };

  // Generate year options from 2022 to 2025
  const yearOptions = Array.from({ length: 4 }, (_, index) => {
    const year = 2022 + index;
    return (
      <option key={year} value={year}>
        {year}
      </option>
    );
  });

  // Generate month options from January to December
  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthName = new Date(0, month - 1).toLocaleString('en-US', { month: 'long' });
    return (
      <option key={month} value={month}>
        {monthName}
      </option>
    );
  });

  // Calculate the number of days in the selected month
  const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth - 1));

  // Generate data for the chart, including days with no data
  const chartData = [
    ['Date', 'Total Sales'],
    ...Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const saleData = monthlySales.find((sale) => sale._id.day === day);

      return [
        `${selectedYear}-${selectedMonth}-${day}`,
        saleData ? saleData.totalSales : 0,
      ];
    }),
  ];

  return (
    <>
      <div>
        <label htmlFor="year">Select Year:</label>
        <select
          id="year"
          onChange={(e) => setSelectedYear(e.target.value)}
          value={selectedYear}
        >
          <option value="">-- Select Year --</option>
          {yearOptions}
        </select>
      </div>
      <div>
        <label htmlFor="month">Select Month:</label>
        <select
          id="month"
          onChange={(e) => setSelectedMonth(e.target.value)}
          value={selectedMonth}
        >
          <option value="">-- Select Month --</option>
          {monthOptions}
        </select>
      </div>
      <button onClick={handleSearch}
        style={{background:"#119afa",
          color: "#fff",
          padding: "5px"
        }}
      >Search</button>
      <DataTable
        columns={columns}
        data={monthlySales}
        pagination
        highlightOnHover
        noHeader
      />

      {monthlySales.length > 0 && (
        <Chart
          width={'100%'}
          height={'400px'}
          chartType="ColumnChart" // Change chart type to ColumnChart for a histogram
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            chart: {
              title: 'Monthly Sales Histogram',
              subtitle: 'Total Sales for each day',
            },
            hAxis: {
              title: 'Date',
            },
            vAxis: {
              title: 'Total Sales',
            },
            bar: { groupWidth: '10%' }, // Adjust the width of the bars
          }}
        />
      )}
    </>
  );
}

export default MonthlySaleReport;
