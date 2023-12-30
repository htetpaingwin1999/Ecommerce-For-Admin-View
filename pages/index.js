import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";
import { FcMoneyTransfer } from 'react-icons/fc';
import {FaCartArrowDown} from 'react-icons/fa';
import {GiExpense} from 'react-icons/gi';
import {MdPendingActions} from 'react-icons/md';
import {TiTick} from 'react-icons/ti';
import {TbHomeCancel} from 'react-icons/tb';
import {RxUpdate} from 'react-icons/rx';
import { Chart } from 'react-google-charts';
import ProductStock from "./../models/ProductStock"; 
import {mongooseConnect} from "../lib/mongoose";
import Orders from "../models/Order";
import { useEffect, useState } from "react";
import axios from "axios";
import { format, getDaysInMonth } from 'date-fns'; // Import date-fns for date formatting and getting days in a month

export default function Home() {

  // console.log(alertCount);
  const {data: session} = useSession();
  const [monthlySales, setMonthlySales] = useState([]);
  const [totalOrders, setTotalorders] = useState(0);
  const [totalConfirmOrders, setTotalConfirmOrders] = useState(0);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [totalCancelOrders, setTotalCancelOrders] = useState(0);

  const daysInMonth = getDaysInMonth(new Date(2023, 9 - 1));
  useEffect(() => {
    fetchMonthlySales();
    fetchTotalOrders();
    fetchTotalConfirmOrders();
    fetchTotalPendingOrders();
    fetchTotalCancelOrders();
  }, []);

  function fetchMonthlySales() {
    axios
      .get(`/api/monthly-sales?year=${"2023"}&month=${"9"}&status=3`) // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        setMonthlySales(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching monthly sales:', error);
      });
  }

  function fetchTotalOrders() {
    axios
      .get("api/totalorders") // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        // console.log("Total Orders")
        // console.log(response.data.length);
        setTotalorders(response.data.length)
      })
      .catch((error) => {
        console.error('Error fetching total orders', error);
      });
  }

  function fetchTotalConfirmOrders() {
    axios
      .get("api/totalConfirmOrders") // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        // console.log("Total Confirmed Orders")
        // console.log(response.data.length);
        setTotalConfirmOrders(response.data.length)
      })
      .catch((error) => {
        console.error('Error fetching total orders', error);
      });
  }

  function fetchTotalPendingOrders() {
    axios
      .get("api/totalPendingOrders") // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        console.log("Total Pending Orders")
        console.log(response.data.length);
        setTotalPendingOrders(response.data.length)
      })
      .catch((error) => {
        console.error('Error fetching total orders', error);
      });
  }

  function fetchTotalCancelOrders() {
    axios
      .get("api/totalCancelOrders") // Replace with your API endpoint and status code for successful sales
      .then((response) => {
        console.log("Total Cancel Orders")
        console.log(response.data.length);
        setTotalCancelOrders(response.data.length)
      })
      .catch((error) => {
        console.error('Error fetching total cancel orders', error);
      });
  }
  const chartOptionsForSaleAmount = {
    title: 'Sales Amount by Month',
    hAxis: {
      title: 'Month',
    },
    vAxis: {
      title: 'Amount',
    },
    bar: { groupWidth: '20%' }, // Adjust the bar width
    chartArea: { width: '70%' }, // Adjust the chart area width
    series: {
      0: { // Style options for series 0 (blue bars)
        type: 'bars',
        borderRadius: 10, // Add border radius to each bar
        color: 'orange', // Change the color of the bars
      },
    },
  };

  // const chartDataForSaleAmount = [
  //   ['Month', 'Sales'],
  //   ['January', 1000],
  //   ['February', 1170],
  //   ['March', 660],
  //   ['April', 1030],
  //   ['May', 800],
  //   ['June', 1200],
  //   ['July', 900],
  //   ['August', 1300],
  //   ['September', 1100],
  //   ['October', 950],
  //   ['November', 850],
  //   ['December', 1050],
  // ];

  const chartDataForSaleAmount = [
    ['Day', 'Sales'],
    ['1', 100000],
    ['2', 117000],
    ['3', 66000],
    ['4', 103000],
    ['5', 80000],
    ['6', 120000],
    ['7', 90000],
    ['8', 130000],
    ['9', 110000],
    ['10', 95000],
    ['11', 100000],
    ['12', 117000],
    ['13', 66000],
    ['14', 103000],
    ['15', 89000],
    ['16', 84000],
    ['17', 90000],
    ['18', 73000],
    ['19', 31000],
    ['20', 50000],
    ['21', 100000],
    ['22', 0],
    ['23', 0],
    ['24', 0],
    ['25', 0],
    ['26', 0],
    ['27', 0],
    ['28', 0],
    ['29', 0],
    ['30', 0],
   
  ];

  const chartOptionsForNoofPeople = {
    title: 'Data Distribution',
    pieHole: 0.68, // Adjust the hole size to make it like a donut chart
    legend: { position: 'bottom' }, // Add legend position
  };

  const chartDataForNoofPeople = [
    ['Data', 'Percentage'],
    ['Visitors', 30],
    ['Purchasers', 20],
    ['User Accounts', 25],
    ['Social Media', 25],
  ];

  const tableDataForTop10Books = [
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/06/postive-300x300.png', name: 'Positive Vibe', quantity: 50 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/06/11-300x300.png', name: 'ကျွန်တော် ဂျက်ကီချန်း', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2019/08/Lar-Chin-Koung-Thaw-300x300.png', name: 'လာခြင်းကောင်းသောအရှင်', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/06/%E1%80%A1%E1%80%81%E1%80%BC%E1%80%B1%E1%80%81%E1%80%B6-1-300x300.png', name: 'အခြေခံဗုဒ္ဓကုထုံးများ', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/06/%E1%80%85%E1%80%AD%E1%80%90%E1%80%BA%E1%80%81%E1%80%BD%E1%80%94%E1%80%BA%E1%80%A1%E1%80%AC%E1%80%B8%E1%81%82-300x300.png', name: 'စိတ်ဓာတ်ခွန်အား', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/07/tadiya-300x300.png', name: 'ခင်ဗျားကို သတိရတာ...', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2020/06/Rule-of-life-300x300.png', name: 'ဘဝရဲ့ စည်းမျဥ်းများ', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/05/%E1%80%A5%E1%80%92%E1%80%AB%E1%80%94%E1%80%BA%E1%80%B8-300x300.png', name: 'ဥဒါန်းသစ်', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/05/%E1%80%99%E1%80%BB%E1%80%80%E1%80%BA%E1%80%80%E1%80%BD%E1%80%9A%E1%80%BA%E1%80%99%E1%80%BC%E1%80%85%E1%80%BA-300x300.png', name: 'မျက်ကွယ်မြစ်', quantity: 25 },
    { image: 'https://www.pannsattlann.com/wp-content/uploads/2023/04/%E1%80%94%E1%80%B1%E1%80%95%E1%80%BB%E1%80%B1%E1%80%AC%E1%80%BA-300x300.png', name: 'နေပျော်ပါတယ်', quantity: 25 },

    // Add more data rows as needed
  ];

  const tableDataForOrders = [
    {
      id: '20002',
      name: 'Htet Paing',
      email: 'htetpaingwin1999@gmail.com',
      total: '8000ကျပ်',
      status: 'ordered',
      date: '27.6.2023',
    },
    {
      id: '20003',
      name: 'Aye Me Me Han',
      email: 'yizhang9899@gmail.com',
      total: '9000ကျပ်',
      status: 'cancel',
      date: '1.7.2023',
    },
    {
      id: '20004',
      name: 'Wint Wah Phoo',
      email: 'lalanom9898@gmail.com',
      total: '40000ကျပ်',
      status: 'cancel',
      date: '4.7.2023',
    },
    {
      id: '20005',
      name: 'Nway Su Paing',
      email: 'nweminthant@gmail.com',
      total: '9000ကျပ်',
      status: 'pending',
      date: '7.7.2023',
    }
  ]

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    backgroundColor: 'white',
  };

  const headerCellStyle = {
    backgroundColor: '#119afa',
    color: 'white',
    fontWeight: 'bold',
    // border: '1px solid black',
    padding: '8px',
  };

  const cellStyle = {
    border: '1px solid black',
    padding: '8px',
    color: 'black',
  };

  const chartData = [
    ['Date', 'Total Sales'],
    ...Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const saleData = monthlySales.find((sale) => sale._id.day === day);

      return [
        `2023-Sep-${day}`,
        saleData ? saleData.totalSales : 0,
      ];
    }),
  ];

  return <Layout>
    <div className="text-blue-900 bg-white p-3 flex justify-between sm:w-1/2 md:w-[calc(100%-10px)] lg:w-[calc(100%-10px)]">
      <h2>
      မင်္ဂလာပါ <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-white gap-1 text-white rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2 text-black">
          {session?.user?.name}
        </span>
      </div>
    </div>
    <div className="my-2 container flex flex-wrap justify-between lg:justify-start"> 
      {/* <div className="box bg-white flex-nowrap rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          <FcMoneyTransfer size={60}></FcMoneyTransfer> <span className="mx-2 text-xl p-3 text-black">Income 3000 Kyats</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
          <button className="flex flex-wrap">
            <RxUpdate></RxUpdate>
            <span className="mx-2">Update Now</span>
          </button>
        </div>
      </div> */}

      {/* <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          <GiExpense size={60} style={{ color: 'red' }} ></GiExpense> <span className="mx-2 text-xl p-3 text-black">Stock 3000 Kyats</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
          <button className="flex flex-wrap">
            <RxUpdate></RxUpdate>
            <span className="mx-2">Update Now</span>
          </button>
        </div>
      </div> */}

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          <FaCartArrowDown size={60} style={{color: '#119afa'}}></FaCartArrowDown><span className="mx-2 text-xl p-3 text-black">Order {totalOrders}</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
        <a href="#" onClick={fetchTotalOrders} className="flex flex-wrap">
          <RxUpdate></RxUpdate>
          <span className="mx-2">Update Now</span>
        </a>
        </div>
      </div>

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          {/* Confirm Ordered */}
          <TiTick size={60} style={{color: '#34b233'}}></TiTick><span className="mx-2 text-xl p-3 text-black">{totalConfirmOrders}</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
        <a href="#" onClick={fetchTotalConfirmOrders} className="flex flex-wrap">
          <RxUpdate></RxUpdate>
          <span className="mx-2">Update Now</span>
        </a>
        </div>
      </div>

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          {/* Pending Order */}
          <MdPendingActions size={60} style={{color: 'orange'}}></MdPendingActions><span className="mx-2 text-xl p-3 text-black">{totalPendingOrders}</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
          <a href="#" onClick={fetchTotalPendingOrders} className="flex flex-wrap">
            <RxUpdate></RxUpdate>
            <span className="mx-2">Update Now</span>
          </a>
        </div>
      </div>

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          {/* Cancel Order */}
          <TbHomeCancel size={60} style={{color: 'red'}}></TbHomeCancel><span className="mx-2 text-xl p-3 text-black">{totalCancelOrders}</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
        <a href="#" onClick={fetchTotalCancelOrders} className="flex flex-wrap">
          <RxUpdate></RxUpdate>
          <span className="mx-2">Update Now</span>
        </a>
        </div>
      </div>
    </div> 

   
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
            chartArea: {
              width: '80%',
            },
            hAxis: {
              title: 'Date',
            },
            vAxis: {
              title: 'Total Sales',
            },
            bar: { groupWidth: '15%' },
            colors: ['orange'],  // Adjust the width of the bars
          }}
        />
      )}
    

  </Layout>
}

// export async function getServerSideProps() {
//   await mongooseConnect(); // Establish the database connection
//   let alertCount = 0; // Initialize alertCount

//   const aggregationPipeline = [
//     {
//       $group: {
//         _id: "$product", // Group by the product field
//         totalQuantity: { $sum: "$quantity" }, // Calculate the total quantity for each group
//         totalPrice: { $first: "$price" }, // Get the price associated with each product
//         date: { $first: "$date" }, // Get the date associated with each product
//       },
//     },
//   ];

//   try {
//     const result = await ProductStock.aggregate(aggregationPipeline);
    
//     for (const product of result) {
//       const productId = product._id; // Get the product ID
//       const quantityCount = await Orders.aggregate([
//         {
//           $unwind: "$line_items", // Unwind the line_items array for matching
//         },
//         {
//           $match: {
//             "line_items.price_data.product_data.productID": productId,
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalQuantity: { $sum: "$line_items.quantity" },
//           },
//         },
//       ]);

//       if (quantityCount.length > 0) {
//         product.totalOrderQuantity = quantityCount[0].totalQuantity;
//       } else {
//         product.totalOrderQuantity = 0; // Assign a default value when quantityCount is empty
//       }
//        // Calculate the difference between totalQuantity and totalOrderQuantity
//        const quantityDifference = product.totalQuantity - product.totalOrderQuantity;

//        // If the difference is less than or equal to 3, increment alertCount
//        if (quantityDifference <= 3) {
//          alertCount++;
//        }
//     }

//     return {
//       props: {
//         productStocks: JSON.parse(JSON.stringify(result)),
//         alertCount: alertCount, // Include alertCount in the props

//       },
//     };
//   } catch (error) {
//     console.error("Error fetching product stocks:", error);

//     return {
//       props: {
//         productStocks: [],
//         alertCount: alertCount, // Include alertCount in the props
//       },
//     };
//   }
// }
