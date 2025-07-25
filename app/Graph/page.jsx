// components/SkinProgressChart.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Cookies from "js-cookie";

const SkinProgressChart = () => {
  const router = useRouter();
  const [chartData, setChartData] = useState([]);
  const [rawData, setRawData] = useState([]); // Store original API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          // No data found, set empty array instead of error
          setChartData([]);
          setLoading(false);
          return;
        }
        const errorText = await response.text();
        console.error('HTTP error:', response.status, response.statusText);
        console.error('Response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    //   const contentType = response.headers.get('content-type');
    //   if (!contentType || !contentType.includes('application/json')) {
    //     throw new Error('Received non-JSON response');
    //   }
      const result = await response.json();
      console.log('API response:', result);
        if (result.success) {
        setRawData(result.data.progressData); // Store original data
        const monthlyData = processMonthlyData(result.data.progressData);
        setChartData(monthlyData);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Scan your face to track your progress');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  const processMonthlyData = (progressData) => {
    if (!progressData || progressData.length === 0) return [];

    // Add initial zero point for better visualization
    const processedData = [];
    
    // Add starting point at zero
    processedData.push({
      month: 'Start',
      dry: 0,
      normal: 0,
      oily: 0
    });    // Use individual data points with month labels
    progressData.forEach((record, index) => {
      const date = new Date(record.timestamp);
      const timeLabel = date.toLocaleDateString('en-US', { 
        month: 'short'
      });
      
      processedData.push({
        month: timeLabel,
        dry: Math.round(parseFloat(record.dry) * 10) / 10,
        normal: Math.round(parseFloat(record.normal) * 10) / 10,
        oily: Math.round(parseFloat(record.oily) * 10) / 10,
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
  // Responsive style helpers
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Desktop and mobile style objects
  const desktopStyles = {
    loadingSpinner: {
      display: 'block',
      margin: '0 auto 12px auto',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      borderBottom: '2px solid #3B82F6',
      animation: 'spin 1s linear infinite',
      overflow: 'hidden',

    },
    loadingText: {
      color: '#636362',
      textAlign: 'center',
      fontSize: '16px',
    },
    errorText: {
      color: '#EF4444',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 600,
    },
    errorSubText: {
      color: '#EF4444',
      textAlign: 'center',
      fontSize: '14px',
    },
    retryButton: {
      marginTop: '8px',
      padding: '8px 20px',
      backgroundColor: '#CEDF9F',
      color: '#fff',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 500,
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      display: 'block',
      margin: '8px auto 0 auto',
    },
    noDataText: {
      color: '#636362',
      textAlign: 'center',
      fontSize: '18px',
      fontWeight: 600,
    },
    noDataSubText: {
      color: '#636362',
      textAlign: 'center',
      fontSize: '14px',
    },
    tooltip: {
      background: '#000',
      padding: '12px',
      border: '1px solid #6B7280',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      color: '#fff',
      fontSize: '14px',
      minWidth: '120px',
    },
    tooltipLabel: {
      fontWeight: 600,
      marginBottom: '4px',
      color: '#fff',
    },
    tooltipDate: {
      fontSize: '12px',
      color: '#D1D5DB',
      marginBottom: '8px',
    },
    tooltipValue: {
      fontSize: '14px',
      margin: 0,
    },
  };

  const mobileStyles = {
    loadingSpinner: {
      display: 'block',
      margin: '0 auto 8px auto',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      borderBottom: '2px solid #3B82F6',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      color: '#636362',
      textAlign: 'center',
      fontSize: '13px',
    },
    errorText: {
      color: '#EF4444',
      textAlign: 'center',
      fontSize: '15px',
      fontWeight: 600,
    },
    errorSubText: {
      color: '#EF4444',
      textAlign: 'center',
      fontSize: '12px',
    },
    retryButton: {
      marginTop: '6px',
      padding: '6px 14px',
      backgroundColor: '#3B82F6',
      color: '#fff',
      borderRadius: '7px',
      border: 'none',
      fontWeight: 500,
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      display: 'block',
      margin: '6px auto 0 auto',
    },
    noDataText: {
      color: '#636362',
      textAlign: 'center',
      fontSize: '15px',
      fontWeight: 600,
    },
    noDataSubText: {
      color: '#636362',
      textAlign: 'center',
      fontSize: '12px',
    },
    tooltip: {
      background: '#000',
      padding: '8px',
      border: '1px solid #6B7280',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      color: '#fff',
      fontSize: '12px',
      minWidth: '90px',
    },
    tooltipLabel: {
      fontWeight: 600,
      marginBottom: '2px',
      color: '#fff',
    },
    tooltipDate: {
      fontSize: '10px',
      color: '#D1D5DB',
      marginBottom: '4px',
    },
    tooltipValue: {
      fontSize: '12px',
      margin: 0,
    },
  };

  // Add styles object for container, header, etc. (previously in styles)
  const styles = {    container: (isMobile) => ({
      width: '100%',
      marginTop: isMobile ? '0' : '120px',
      borderRadius: '18px',
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
      padding: isMobile ? '16px' : '32px',
      backgroundColor: '#1d1d1d',
      margin: isMobile ? '0' : '0 auto',
      maxWidth: isMobile ? '100%' : '1400px', // Increased for more landscape orientation
      minHeight: isMobile ? '400px' : '600px',
      boxSizing: 'border-box',
    }),
    header: (isMobile) => ({
      marginBottom: isMobile ? '18px' : '32px',
    }),    title: (isMobile) => ({
      fontSize: isMobile ? '22px' : '28px',
      fontWeight: 700,
      color: '#EBEBEB',
      marginBottom: 0,
      lineHeight: 1.2,
    }),
    subtitle: (isMobile) => ({
      fontSize: isMobile ? '12px' : '15px',
      color: '#636362',
      marginBottom: isMobile ? '8px' : '0',
    }),
    trendNote: (isMobile) => ({
      marginTop: '8px',
      padding: isMobile ? '8px' : '12px',
      borderRadius: '10px',
      backgroundColor: 'rgba(206, 223, 159, 0.1)',
      border: '1px solid #CEDF9F',
      color: '#CEDF9F',
      fontSize: isMobile ? '11px' : '13px',
    }),
    legend: (isMobile) => ({
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '12px' : '24px',
      marginBottom: isMobile ? '10px' : '18px',
    }),
    legendItem: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#EBEBEB',
      fontSize: '13px',
      fontWeight: 500,
    }),
    legendDot: (color) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
    }),    chart: (isMobile) => ({
      width: '100%',
      height: isMobile ? '220px' : '320px', // Increased height for landscape
      marginBottom: isMobile ? '12px' : '18px',
    }),
    statsGrid: (isMobile) => ({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: isMobile ? '8px' : '16px',
      marginTop: isMobile ? '12px' : '24px',
    }),
    statCard: (bg, color) => ({
      textAlign: 'center',
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: bg,
      color: color,
    }),
    statLabel: (color) => ({
      fontSize: '12px',
      color: color,
      marginBottom: '2px',
    }),
    statValue: (color) => ({
      fontSize: '18px',
      fontWeight: 700,
      color: color,
    }),
  };

  // Use styles based on isMobile
  const s = isMobile ? mobileStyles : desktopStyles;

  // Define CustomTooltip inside the component so it is available
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div style={s.tooltip}>
          <p style={s.tooltipLabel}>{label}</p>
          {dataPoint?.fullDate && (
            <p style={s.tooltipDate}>{dataPoint.fullDate}</p>
          )}          {payload.map((entry, index) => (
            <p key={index} style={{ ...s.tooltipValue, color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={styles.container(isMobile)}>
        <div style={s.loadingSpinner}></div>
        <p style={s.loadingText}>Loading progress data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container(isMobile)}>
        <div style={{ textAlign: 'center' }}>
          <p style={s.errorText}>Scan your face to track your progress</p>
          <button 
            onClick={() => router.push('/FaceScan')}
            style={s.retryButton}
          >
            Start Face Scan
          </button>
        </div>
      </div>
    );
  }
  if (chartData.length === 0) {
    return (
      <div style={styles.container(isMobile)}>
        <div style={{ textAlign: 'center' }}>
          <p style={s.noDataText}>Scan your face to track your progress</p>
          <button 
            onClick={() => router.push('/FaceScan')}
            style={s.retryButton}
          >
            Start Face Scan
          </button>
        </div>
      </div>
    );
  }  // Calculate progress metrics with better logic
  const calculateProgress = () => {
    if (chartData.length < 2) return null;
    
    const firstReading = chartData[1]; // Skip 'Start' point
    const lastReading = chartData[chartData.length - 1];
    
    // Better progress calculation based on skin health science
    // Target: Normal skin 50-70%, Dry skin <25%, Oily skin <35%
    
    // Calculate how close we are to ideal skin composition
    const normalTarget = 60; // Ideal normal skin percentage
    const dryTarget = 15;     // Ideal dry skin percentage (lower is better)
    const oilyTarget = 25;    // Ideal oily skin percentage (lower is better)
    
    // Score each skin type (0-100)
    const normalScore = Math.max(0, 100 - Math.abs(lastReading.normal - normalTarget) * 2);
    const dryScore = Math.max(0, 100 - Math.max(0, lastReading.dry - dryTarget) * 3);
    const oilyScore = Math.max(0, 100 - Math.max(0, lastReading.oily - oilyTarget) * 2.5);
    
    // Calculate improvement trend
    const normalImprovement = (lastReading.normal - firstReading.normal);
    const dryImprovement = (firstReading.dry - lastReading.dry); // Decrease is good
    const oilyImprovement = (firstReading.oily - lastReading.oily); // Decrease is good
    
    // Trend score (how much we're improving)
    const trendScore = Math.max(0, Math.min(100, 
      (normalImprovement * 2) + (dryImprovement * 1.5) + (oilyImprovement * 1.5) + 50
    ));
    
    // Combined score: 60% current state + 40% improvement trend
    const overallProgress = Math.round(
      (normalScore * 0.4 + dryScore * 0.2 + oilyScore * 0.2) * 0.6 + 
      trendScore * 0.4
    );
    
    return {
      overall: Math.max(0, Math.min(100, overallProgress)),
      normalChange: normalImprovement,
      dryChange: -dryImprovement, // Show as positive when improving
      oilyChange: -oilyImprovement, // Show as positive when improving
      currentNormal: lastReading.normal,
      currentDry: lastReading.dry,
      currentOily: lastReading.oily
    };
  };// Calculate days since last scan
  const calculateDaysSinceLastScan = () => {
    if (!rawData || rawData.length === 0) return 0;
    
    // Get the most recent scan timestamp
    const lastScan = rawData[rawData.length - 1];
    const lastScanDate = new Date(lastScan.timestamp);
    const currentDate = new Date();
    
    const diffTime = Math.abs(currentDate - lastScanDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Circular Progress Component
  const CircularProgress = ({ progress, size = 120 }) => {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#636362"
            strokeWidth="6"
            fill="transparent"
            opacity="0.3"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#CEDF9F"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />
        </svg>        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div style={{ color: '#CEDF9F', fontSize: '32px', fontWeight: 'bold' }}>
              {progress}%
            </div>
            <div style={{ color: '#636362', fontSize: '12px' }}>
              shoo
            </div>
          </div>
        </div>
      </div>
    );
  };
  const progressData = calculateProgress();
  const daysSinceLastScan = calculateDaysSinceLastScan();
  
  // For single data point, add note about needing more data for trends
  const showTrendNote = chartData.length === 1;
  return (
    <div style={styles.container(isMobile)}>      
    {/* Header */}
      <div style={styles.header(isMobile)}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: isMobile ? '6px' : '12px'
        }}>
          <h2 style={styles.title(isMobile)}>
            track your progress
          </h2>
          <div style={{ 
            color: '#636362', 
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            filter
          </div>
        </div><p style={styles.subtitle(isMobile)}>
          Individual readings showing skin type percentages over time
        </p>
        {showTrendNote && (
          <div style={styles.trendNote(isMobile)}>
            <p>
              💡 Continue tracking for multiple months to see trends and patterns
            </p>
          </div>
        )}
      </div>      
      {/* Legend */}
      <div style={styles.legend(isMobile)}>
        <div style={styles.legendItem('#636362')}>
          <div style={styles.legendDot('#636362')}></div>
          <span>Dry Skin</span>
        </div>
        <div style={styles.legendItem('#CEDF9F')}>
          <div style={styles.legendDot('#CEDF9F')}></div>
          <span>Normal Skin</span>
        </div>
        <div style={styles.legendItem('#636362')}>
          <div style={styles.legendDot('#636362')}></div>
          <span>Oily Skin</span>
        </div>
      </div>      
      {/* Main Content Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '20px' : '30px',
        alignItems: isMobile ? 'center' : 'flex-start'
      }}>
        {/* Chart Section - Left Side */}        
        <div style={{ 
          flex: isMobile ? '1' : '4', // Changed from 3 to 4 for even more space
          width: isMobile ? '100%' : '80%' // Increased from 75% to 80%
        }}>
          <div style={styles.chart(isMobile)}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#EBEBEB' }}
                  axisLine={{ stroke: '#EBEBEB' }}
                  tickLine={{ stroke: '#EBEBEB' }}
                  interval={0}
                  angle={chartData.length > 5 ? -45 : 0}
                  textAnchor={chartData.length > 5 ? 'end' : 'middle'}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#EBEBEB' }}
                  axisLine={{ stroke: '#EBEBEB' }}
                  tickLine={{ stroke: '#EBEBEB' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Three lines with custom colors and smooth curves */}
                <Line 
                  type="monotone" 
                  dataKey="dry" 
                  stroke="#636362"
                  strokeWidth={3}
                  name="Dry"
                  dot={{ fill: '#636362', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#636362', strokeWidth: 2 }}
                  connectNulls={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="normal" 
                  stroke="#CEDF9F"
                  strokeWidth={3}
                  name="Normal"
                  dot={{ fill: '#CEDF9F', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#CEDF9F', strokeWidth: 2 }}
                  connectNulls={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="oily" 
                  stroke="#636362"
                  strokeWidth={3}
                  name="Oily"
                  dot={{ fill: '#636362', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#636362', strokeWidth: 2 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Section - Right Side */}
        {progressData && (          <div style={{ 
            flex: isMobile ? '1' : '1',
            width: isMobile ? '100%' : '20%', // Reduced from 25% to 20% for more compact side panel
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px', // Reduced gap from 16px to 12px
            minWidth: '180px' // Reduced minimum width from 200px to 180px
          }}>
            {/* Circular Progress */}
            <div style={{ textAlign: 'center' }}>
              <CircularProgress progress={progressData.overall} size={isMobile ? 100 : 120} />
              <div style={{ 
                color: '#EBEBEB', 
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '600',
                marginTop: '8px'
              }}>
                Overall Progress
              </div>
            </div>

            {/* Days Counter */}            
            <div style={{
              textAlign: 'center',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(235, 235, 235, 0.05)',
              border: '1px solid rgba(235, 235, 235, 0.1)',
              width: '100%'
            }}>
              <div style={{ 
                color: '#CEDF9F', 
                fontSize: isMobile ? '28px' : '32px',
                fontWeight: 'bold',
                lineHeight: 1
              }}>
                {daysSinceLastScan}
              </div>
              <div style={{ 
                color: '#636362', 
                fontSize: isMobile ? '11px' : '12px',
                marginTop: '4px'
              }}>
                days since your last scan
              </div>
            </div>            
            {/* Progress Metrics - Skin Type Percentages */}
            <div style={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Normal Skin */}              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#CEDF9F',
                fontSize: '13px'
              }}>
                <span>normal skin:</span>
                <span style={{ fontWeight: 'bold' }}>{progressData.currentNormal.toFixed(1)}%</span>
              </div>              {/* Dry Skin */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#636362',
                fontSize: '13px'
              }}>
                <span>dry skin:</span>
                <span style={{ fontWeight: 'bold' }}>{progressData.currentDry.toFixed(1)}%</span>
              </div>              {/* Oily Skin */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#636362',
                fontSize: '13px'
              }}>
                <span>oily skin:</span>
                <span style={{ fontWeight: 'bold' }}>{progressData.currentOily.toFixed(1)}%</span>
              </div>

              {/* Progress Changes */}
              <div style={{ 
                borderTop: '1px solid rgba(235, 235, 235, 0.1)', 
                paddingTop: '8px', 
                marginTop: '4px' 
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: progressData.normalChange >= 0 ? '#CEDF9F' : '#636362',
                  fontSize: '12px'
                }}>
                  <span>normal change:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {progressData.normalChange >= 0 ? '+' : ''}{progressData.normalChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>{/* Summary Stats */}
      <div style={styles.statsGrid(isMobile)}>
        <div style={styles.statCard('rgba(99, 99, 98, 0.1)', '#636362')}>
          <p style={styles.statLabel('#636362')}>Latest Dry</p>
          <p style={styles.statValue('#636362')}>
            {chartData[chartData.length - 1]?.dry}%
          </p>
        </div>
        <div style={styles.statCard('rgba(206, 223, 159, 0.1)', '#CEDF9F')}>
          <p style={styles.statLabel('#636362')}>Latest Normal</p>
          <p style={styles.statValue('#CEDF9F')}>
            {chartData[chartData.length - 1]?.normal}%
          </p>
        </div>
        <div style={styles.statCard('rgba(99, 99, 98, 0.1)', '#636362')}>
          <p style={styles.statLabel('#636362')}>Latest Oily</p>
          <p style={styles.statValue('#636362')}>
            {chartData[chartData.length - 1]?.oily}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkinProgressChart;