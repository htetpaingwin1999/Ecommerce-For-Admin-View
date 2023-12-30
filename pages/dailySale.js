import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns'; // Import date-fns for date formatting
import PieChartModule from './PieChartModule'; // Import the PieChartModule

function DailySaleReport() {
  const [dailySales, setDailySales] = useState([]);
  const [dailySalesForPieChart, setDailySalesForPieChart] = useState([]);
  let [todaySaleAmount, setTodaySaleAmount] = useState(0);
  useEffect(() => {
    fetchDailySales();
    fetchDailySalesForPieChart();
  }, []);

  function fetchDailySales() {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    axios
      .get(`/api/daily-sales?date=${formattedDate}&status=3`) // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        setDailySales(response.data);
      })
      .catch((error) => {
        console.error('Error fetching daily sales:', error);
      });
  }

  function fetchDailySalesForPieChart() {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    axios
      .get(`/api/daily-salesreportforproduct?date=${formattedDate}&status=3`) // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        setDailySalesForPieChart(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching daily sales:', error);
      });
  }

  // Define columns for the table
  const columns = [
    {
      name: 'Products',
      selector: (row) => (
        <>
          {row.line_items.map(l => (
            <>
              {l.price_data?.product_data.productTitle}<br/>
            </>
          ))}
        </>
      ),
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'Quantitiy',
      selector: (row) => (
        <>
          {row.line_items.map(l => (
            <>
              {l.quantity}အုပ်<br/>
            </>
          ))}
        </>
      ),
      sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
    },
    {
      name: 'PayAmount',
      selector: (row) => {
        // Calculate the sum of l.pay_amount
        const totalPayAmount = row.line_items.reduce((acc, l) => acc + l.price_data.pay_amount, 0);
        return (
          <>

            {row.line_items.map((l) => {
              todaySaleAmount = todaySaleAmount + l.price_data.pay_amount; // Accumulate pay_amount into todaySales
              return (
                <>
                  {l.price_data.pay_amount}ကျပ်<br />
                </>
              );
              setTodaySaleAmount(todaySaleAmount);
            })}
          </>
        );
      }
      ,sortable: true,
      style: {
        width: '50px', // Set the desired width here
      },
    },   
  ];

 
  return (
    <>
      <DataTable
        columns={columns}
        data={dailySales}
        pagination
        highlightOnHover
        noHeader
      />
      {dailySalesForPieChart && (
        <PieChartModule
          data={dailySalesForPieChart}
          title="Product Sales"
        />
      )}
    </>
  );
}

export default DailySaleReport;
