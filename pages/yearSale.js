import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import DataTable from 'react-data-table-component';
import { Chart } from 'react-google-charts';

function YearlySaleReport() {
  const [yearlySales, setYearlySales] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchYearlySales();
  }, []);

  function fetchYearlySales() {
    if (!selectedYear) {
      return; // Do not make the request if year is not selected
    }

    axios
      .get(`/api/yearly-sales?year=${selectedYear}&status=3`)
      .then((response) => {
        setYearlySales(response.data);
      })
      .catch((error) => {
        console.error('Error fetching yearly sales:', error);
      });
  }

  // Define columns for the table
  const columns = [
    {
      name: 'Month',
      selector: (row) => {
        const { month } = row._id;
        return new Date(selectedYear, month - 1, 1).toLocaleDateString('en-US', {
          month: 'long',
        });
      },
      sortable: true,
    },
    {
      name: 'Year',
      selector: (row) => row._id.year,
      sortable: true,
    },
    {
      name: 'Total Sales',
      selector: 'totalSales',
      sortable: true,
    },
    {
      name: 'Total Quantity',
      selector: 'totalOrders',
      sortable: true,
    },
  ];

  const handleSearch = () => {
    fetchYearlySales(); // Fetch data when the search button is clicked
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

  // Generate data for the chart
  const chartData = [
    ['Month', 'Total Sales', 'Total Quantity'],
    ...Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthData = yearlySales.find((data) => data._id.month === month);

      return [
        new Date(selectedYear, month - 1, 1).toLocaleDateString('en-US', {
          month: 'long',
        }),
        monthData ? monthData.totalSales : 0,
        monthData ? monthData.totalOrders : 0,
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
      <button
        onClick={handleSearch}
        style={{
          background: '#119afa',
          color: '#fff',
          padding: '5px',
        }}
      >
        Search
      </button>
      <DataTable
        columns={columns}
        data={yearlySales}
        pagination
        highlightOnHover
        noHeader
      />
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          chart: {
            title: 'Yearly Sales for Selected Year',
            subtitle: 'Total Sales and Total Quantity for each month',
          },
          hAxis: {
            title: 'Month',
          },
          vAxis: {
            title: 'Total Sales and Total Quantity',
          },
          bar: { groupWidth: '10%' },
        }}
      />
    </>
  );
}

export default YearlySaleReport;
