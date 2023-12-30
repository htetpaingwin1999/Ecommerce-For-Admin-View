import Layout from '@/components/Layout';
import React, { useState } from 'react';
import DailySaleReport from './dailySale';
import MonthlySaleReport from './monthlySale';
import YearlySaleReport from './yearSale';

function ReviewPage() {
  const [activeTab, setActiveTab] = useState('daily');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Layout>
      <h2>Sales Review</h2>

      {/* Tabs for switching between Daily, Monthly, and Yearly Sales */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => handleTabChange('daily')}
        >
          Daily
        </button>
        <button
          className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => handleTabChange('monthly')}
        >
          Monthly
        </button>
        <button
          className={`tab ${activeTab === 'yearly' ? 'active' : ''}`}
          onClick={() => handleTabChange('yearly')}
        >
          Yearly
        </button>
      </div>

      {/* Render the appropriate sales component based on the active tab */}
      {activeTab === 'daily' && <DailySaleReport />}
      {activeTab === 'monthly' && <MonthlySaleReport />}
      {activeTab === 'yearly' && <YearlySaleReport />}

      <style jsx>{`
        .tabs {
          display: flex;
        }

        .tab {
          padding: 10px 20px;
          background-color: gray; /* Default background color for non-active tabs */
          cursor: pointer;
          color: #000;
        }

        .tab.active {
          background-color: #119afa; /* Background color for the active tab */
          color:#fff;
        }
      `}</style>
    </Layout>
  );
}

export default ReviewPage;
