'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Cookies from 'js-cookie';

const OnlyGraph = () => {
  const router = useRouter();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define styles object
  const styles = {
    container: {
      width: '100%',
    },
    loadingContainer: {
      width: '100%',
      // height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingInner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    loadingSpinner: {
      width: '32px',
      height: '32px',
      borderBottom: '2px solid #636362',
      borderRadius: '50%',
      marginBottom: '12px',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      color: '#9CA3AF',
      fontSize: '14px'
    },
    errorContainer: {
      width: '100%',
      // height: '320px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    errorInner: {
      textAlign: 'center'
    },
    errorTitle: {
      color: '#F87171',
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '8px'
    },
    errorMessage: {
      color: '#F87171',
      fontSize: '14px',
      marginBottom: '16px'
    },
    retryButton: {
      padding: '8px 16px',
      backgroundColor: '#CEED9F',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 0.2s',
      display: 'block',
      margin: '0 auto',
      ':hover': {
        backgroundColor: '#1D4ED8'
      }
    },
    noDataContainer: {
      width: '100%',
      // height: '320px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    noDataInner: {
      textAlign: 'center'
    },
    noDataTitle: {
      color: '#9CA3AF',
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '8px'
    },
    noDataText: {
      color: '#9CA3AF',
      fontSize: '14px'
    },
    legendContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      // marginBottom: '16px'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    legendDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: color
    }),
    legendText: {
      color: '#4B5563',
      fontSize: '12px',
      fontWeight: 500
    },
    chartContainer: {
      
      // minHeight: '240px',
    },
    tooltip: {
      backgroundColor: '#000',
      padding: '12px',
      border: '1px solid #636362',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      color: 'white',
      fontSize: '14px',
      minWidth: '128px'
    },
    tooltipTitle: {
      fontWeight: 600,
      marginBottom: '4px'
    },
    tooltipDate: {
      fontSize: '12px',
      color: '#D1D5DB',
      marginBottom: '8px'
    },
    tooltipValue: {
      fontSize: '14px',
      margin: 0
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/skinprogress/progress`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        }
      });
      
      if (!response.ok) {
        if (response.status === 404 || response.status === 400) {
          // No data found, show dummy data instead of empty array
          const dummyData = generateDummyData();
          setChartData(dummyData);
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      if (data.success) {
        const processedData = processMonthlyData(data.data.progressData);
        setChartData(processedData);
      } else {
        // If API call succeeds but no data, show dummy data
        const dummyData = generateDummyData();
        setChartData(dummyData);
      }
    } catch (err) {
      // On error, show dummy data instead of error state
      const dummyData = generateDummyData();
      setChartData(dummyData);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateDummyData = () => {
    // Generate dummy data points for a flat graph
    return [
      { month: 'Jan', dry: 30, normal: 40, oily: 30, isDummy: true },
      { month: 'Feb', dry: 30, normal: 40, oily: 30, isDummy: true },
      { month: 'Mar', dry: 30, normal: 40, oily: 30, isDummy: true },
      { month: 'Apr', dry: 30, normal: 40, oily: 30, isDummy: true },
      { month: 'May', dry: 30, normal: 40, oily: 30, isDummy: true },
      { month: 'Jun', dry: 30, normal: 40, oily: 30, isDummy: true }
    ];
  };

  const processMonthlyData = (progressData) => {
    if (!progressData || progressData.length === 0) {
      // Return dummy data when no real data is available
      return generateDummyData();
    }

    const processedData = [];
    // Add starting point at zero
    processedData.push({
      month: 'Start',
      dry: 0,
      normal: 0,
      oily: 0
    });

    progressData.forEach((record) => {
      // Support both old and new API formats
      let dry, normal, oily, timestamp;
      if (record.detailedAnalysis && record.detailedAnalysis.front && record.detailedAnalysis.front.confidenceScores) {
        // New format
        dry = parseFloat(record.detailedAnalysis.front.confidenceScores.dry);
        normal = parseFloat(record.detailedAnalysis.front.confidenceScores.normal);
        oily = parseFloat(record.detailedAnalysis.front.confidenceScores.oily);
        timestamp = record.timestamp || record.date;
      } else {
        // Old format
        dry = parseFloat(record.dry);
        normal = parseFloat(record.normal);
        oily = parseFloat(record.oily);
        timestamp = record.timestamp || record.date;
      }
      const date = new Date(timestamp);
      const timeLabel = date.toLocaleDateString('en-US', { month: 'short' });
      processedData.push({
        month: timeLabel,
        dry: Math.round(dry * 10) / 10,
        normal: Math.round(normal * 10) / 10,
        oily: Math.round(oily * 10) / 10,
        fullDate: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    });
    return processedData;
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      
      // Show different tooltip for dummy data
      if (dataPoint?.isDummy) {
        return (
          <div style={styles.tooltip}>
            <p style={styles.tooltipTitle}>Sample Data</p>
            <p style={styles.tooltipDate}>Scan your face to see real progress</p>
          </div>
        );
      }
      
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipTitle}>{label}</p>
          {dataPoint?.fullDate && (
            <p style={styles.tooltipDate}>{dataPoint.fullDate}</p>
          )}
          {payload.map((entry, index) => (
            <p key={index} style={{ ...styles.tooltipValue, color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Helper to detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingInner}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorInner}>
          <p style={styles.errorTitle}>Scan your face to track your progress</p>
          <button 
            onClick={() => router.push('/FaceScan')}
            style={styles.retryButton}
          >
            Start Face Scan
          </button>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={styles.noDataContainer}>
        <div style={styles.noDataInner}>
          <p style={styles.noDataTitle}>Scan your face to track your progress</p>
          <button 
            onClick={() => router.push('/FaceScan')}
            style={styles.retryButton}
          >
            Start Face Scan
          </button>
        </div>
      </div>
    );
  }

  // Check if we're showing dummy data
  const isShowingDummyData = chartData.length > 0 && chartData[0]?.isDummy;

  return (
    <div style={styles.container}>
      {/* Legend */}
      {!isMobile && (
        <div style={styles.legendContainer}>
          <div style={styles.legendItem}>
            <div style={styles.legendDot('#636362')}></div>
            <span style={styles.legendText}>Dry Skin</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendDot('#CEDF9F')}></div>
            <span style={styles.legendText}>Normal Skin</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendDot('#636362')}></div>
            <span style={styles.legendText}>Oily Skin</span>
          </div>
        </div>
      )}
      {/* Chart */}
      <div style={{...styles.chartContainer,width: isMobile ? '43vw' : '100%',left: isMobile ? '-15px' : '0',
      position: isMobile ? 'relative' : 'static', width: isMobile ? '40vw' : '100%'}}> {/* Full width on mobile */}
        <ResponsiveContainer width={isMobile ? '100%' : '100%'} height={isMobile ? 80 : 130}>
          <LineChart 
            data={chartData}
            margin={{ top: isMobile ? 0 : 20, right:isMobile ? 0 : 30, left: isMobile ? -25 : -10, bottom: 0 }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> */}
            <XAxis
              dataKey="month" 
              tick={{ fontSize: isMobile ? 8 : 12, fill: '#666' }}
              axisLine={{ stroke: '#666' }}
              tickLine={{ stroke: '#666' }}
              interval={0}
              angle={chartData.length > 5 ? -45 : 0}
              textAnchor={chartData.length > 5 ? 'end' : 'middle'}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: isMobile ? 8 : 14, fill: '#666' }}
              axisLine={{ stroke: '#666' }}
              tickLine={{ stroke: '#666' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="dry" 
              stroke="#636362"
              strokeWidth={2}
              name="Dry"
              dot={{ fill: '#636362', strokeWidth: 1, r: 3 }}
              activeDot={{ r: 3, stroke: '#636362', strokeWidth: 2 }}
              connectNulls={true}
            />
            <Line 
              type="monotone" 
              dataKey="normal" 
              stroke="#CEDF9F"
              strokeWidth={3}
              name="Normal"
              dot={{ fill: '#CEDF9F', strokeWidth: 3, r: 2 }}
              activeDot={{ r: 3, stroke: '#CEDF9F', strokeWidth: 2 }}
              connectNulls={true}
            />
            <Line 
              type="monotone" 
              dataKey="oily" 
              stroke="#636362"
              strokeWidth={2}
              name="Oily"
              dot={{ fill: '#636362', strokeWidth: 1, r: 3 }}
              activeDot={{ r: 3, stroke: '#636362', strokeWidth: 2 }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OnlyGraph;