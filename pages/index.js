import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";
import { FcMoneyTransfer } from 'react-icons/fc';
import {FaCartArrowDown} from 'react-icons/fa';
import {GiExpense} from 'react-icons/gi';
import {TiTick} from 'react-icons/ti';
import {RxUpdate} from 'react-icons/rx';
import { Chart } from 'react-google-charts';

export default function Home() {
  const {data: session} = useSession();
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

  const chartDataForSaleAmount = [
    ['Month', 'Sales'],
    ['January', 1000],
    ['February', 1170],
    ['March', 660],
    ['April', 1030],
    ['May', 800],
    ['June', 1200],
    ['July', 900],
    ['August', 1300],
    ['September', 1100],
    ['October', 950],
    ['November', 850],
    ['December', 1050],
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
      status: 'deliver',
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
      status: 'order',
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
      <div className="box bg-white flex-nowrap rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          <FcMoneyTransfer size={60}></FcMoneyTransfer> <span className="mx-2 text-xl p-3 text-black">Income 3000 Kyats</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
          <button className="flex flex-wrap">
            <RxUpdate></RxUpdate>
            <span className="mx-2">Update Now</span>
          </button>
        </div>
      </div>

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          <GiExpense size={60} style={{ color: 'red' }} ></GiExpense> <span className="mx-2 text-xl p-3 text-black">Expense 3000 Kyats</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
          <button className="flex flex-wrap">
            <RxUpdate></RxUpdate>
            <span className="mx-2">Update Now</span>
          </button>
        </div>
      </div>

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          <FaCartArrowDown size={60} style={{color: '#119afa'}}></FaCartArrowDown><span className="mx-2 text-xl p-3 text-black">Order 50</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
          <button className="flex flex-wrap">
            <RxUpdate></RxUpdate>
            <span className="mx-2">Update Now</span>
          </button>
        </div>
      </div>

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <div className="flex flex-wrap justify-between p-4">
          <TiTick size={60} style={{color: '#34b233'}}></TiTick><span className="mx-2 text-xl p-3 text-black">80</span>
        </div>
        <div className="bg-blue-400 rounded-lg p-2 text-white">
          <button className="flex flex-wrap">
            <RxUpdate></RxUpdate>
            <span className="mx-2">Update Now</span>
          </button>
        </div>
      </div>
    </div> 

    <div className="mt-10 container flex flex-wrap justify-between lg:justify-start"
    style={{  paddingTop: '10px', paddingBottom: '10px'}}
    > 
      <div className="box flex flex-nowrap rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(75%-10px)] mb-4 lg:mb-0 mr-2" >
        <Chart
          chartType="ColumnChart" // Use ColumnChart for a bar chart
          data={chartDataForSaleAmount}
          options={chartOptionsForSaleAmount}
          width="100%"
          height="400px"
        />
      </div>

      <div className="box flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
          <Chart
            chartType="PieChart"
            data={chartDataForNoofPeople}
            options={chartOptionsForNoofPeople}
            width="100%"
            height="400px"
          />
      </div> 
    </div> 

    <div className="mt-10 container flex flex-wrap justify-between lg:justify-start"
    style={{  paddingTop: '10px', paddingBottom: '10px'}}
    > 
      <div className="box flex flex-nowrap rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(75%-10px)] mb-4 lg:mb-0 mr-2" >
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>Name</th>
              <th style={headerCellStyle}>Total</th>
              <th style={headerCellStyle}>Status</th>
              <th style={headerCellStyle}>Date</th>

            </tr>
          </thead>
          <tbody>
            {tableDataForOrders.map((data, index) => (
              <tr key={index} style={cellStyle}>
                <td className="text-center">{data.id}</td>
                <td className="text-center">{data.name}</td>
                <td className="text-center">{data.total}</td>
                <td className="text-center">
                  <button
                  style={{
                    backgroundColor: data.status === 'cancel' ? 'lightcoral' : data.status === 'order' ? 'lightsalmon' : data.status === 'deliver' ? 'lightgreen' : '',
                    color: data.status === 'cancel' ? 'darkred' : data.status === 'order' ? 'white' : data.status === 'deliver' ? 'darkgreen' : '',
                    borderRadius: '20px',
                    padding: '5px 10px',
                    border: 'none',
                  }}
                  >
                  {data.status}
                  </button>
                </td>
                <td className="text-center">{data.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="box bg-white flex-nowrap text-white rounded-lg w-full sm:w-1/2 md:w-[calc(50%-10px)] lg:w-[calc(25%-10px)] mb-4 lg:mb-0 mr-2">
        <h3 className="p-3 text-black">"ဂျူလိုင်လ" အတွက် ရောင်းအားအကောင်းဆုံး စာအုပ်များ</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Item</th>
              <th style={headerCellStyle}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {tableDataForTop10Books.map((data, index) => (
              <tr key={index} style={cellStyle}>
                <td className="flex flex-wrap">
                  <img src={data.image} alt="Item" style={{width: '30px'}} />
                  {data.name}
                </td>
                <td>{data.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
    </div> 

  </Layout>
}
