import React from 'react';
import { Chart } from 'react-google-charts';

function PieChartModule({ data, title }) {
  return (
    <div>
      <br/>
      <h2>{title}</h2>
      <Chart
        width={'100%'}
        height={'300px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ['Category', 'Sales'],
          ...data.map((item) => [item.productTitle, item.totalSale]),
        ]}
        options={{
          title: 'Product Sales',
        }}
      />
    </div>
  );
}

export default PieChartModule;
