// 'use client';
// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Cookies from 'js-cookie';

// const MonthlySkinChart = () => {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Handle responsive breakpoints
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     fetchMonthlySkinData();
//   }, []);

//   const fetchMonthlySkinData = async () => {
//     try {
//       setLoading(true);
//       const token = Cookies.get('token');
      
//       if (!token) {
//         setError('No authentication token found');
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/skinprogress/monthly`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//           'ngrok-skip-browser-warning': 'true'
//         }
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         // Format data for the chart
//         const formattedData = data.data.monthlyProgress.map(item => ({
//           month: `${item.monthName.substring(0, 3)} ${item.year}`,
//           dry: item.dry,
//           normal: item.normal,
//           oily: item.oily,
//           analysisCount: item.analysisCount
//         }));
        
//         setChartData(formattedData);
//       } else {
//         setError(data.message || 'Failed to load skin progress data');
//       }
//     } catch (error) {
//       console.error('Error fetching monthly skin data:', error);
//       setError('Failed to load skin progress data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Custom tooltip component
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{
//           backgroundColor: '#2a2a2a',
//           padding: '12px',
//           borderRadius: '8px',
//           border: '1px solid #444',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
//         }}>
//           <p style={{ color: '#fff', margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ 
//               color: entry.color, 
//               margin: '4px 0',
//               fontSize: '14px'
//             }}>
//               {`${entry.dataKey}: ${entry.value.toFixed(2)}%`}
//             </p>
//           ))}
//           <p style={{ color: '#888', margin: '8px 0 0 0', fontSize: '12px' }}>
//             {`${payload[0]?.payload?.analysisCount || 0} analyses`}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (loading) {
//     return (
//       <div style={{
//         backgroundColor: '#171717',
//         borderRadius: '16px',
//         padding: '40px',
//         margin: '20px 0',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '400px'
//       }}>
//         <div style={{ color: '#fff', fontSize: '16px' }}>Loading skin progress chart...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{
//         backgroundColor: '#171717',
//         borderRadius: '16px',
//         padding: '40px',
//         margin: '20px 0',
//         textAlign: 'center'
//       }}>
//         <div style={{ color: '#ff6b6b', fontSize: '16px', marginBottom: '12px' }}>
//           Error loading chart
//         </div>
//         <div style={{ color: '#888', fontSize: '14px' }}>{error}</div>
//       </div>
//     );
//   }

//   if (chartData.length === 0) {
//     return (
//       <div style={{
//         backgroundColor: '#171717',
//         borderRadius: '16px',
//         padding: '40px',
//         margin: '20px 0',
//         textAlign: 'center'
//       }}>
//         <div style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>
//           No Skin Progress Data Yet
//         </div>
//         <div style={{ color: '#888', fontSize: '14px' }}>
//           Complete a few skin analyses to see your progress over time
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       backgroundColor: '#171717',
//       borderRadius: '16px',
//       padding: isMobile ? '20px' : '30px',
//       margin: '20px 0',
//       color: '#fff'
//     }}>
//       <div style={{ marginBottom: '30px' }}>
//         <h2 style={{ 
//           fontSize: isMobile ? '20px' : '24px',
//           fontWeight: '600',
//           margin: '0 0 8px 0',
//           color: '#fff'
//         }}>
//           Monthly Skin Progress
//         </h2>
//         <p style={{ 
//           color: '#888',
//           fontSize: '14px',
//           margin: '0'
//         }}>
//           Track your skin type distribution over time
//         </p>
//       </div>

//       <div style={{ 
//         height: isMobile ? '300px' : '400px',
//         width: '100%'
//       }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={chartData}
//             margin={{
//               top: 20,
//               right: 30,
//               left: 20,
//               bottom: 20,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//             <XAxis 
//               dataKey="month" 
//               stroke="#888"
//               fontSize={12}
//               tick={{ fill: '#888' }}
//             />
//             <YAxis 
//               stroke="#888"
//               fontSize={12}
//               tick={{ fill: '#888' }}
//               domain={[0, 100]}
//               label={{ 
//                 value: 'Percentage (%)', 
//                 angle: -90, 
//                 position: 'insideLeft',
//                 style: { textAnchor: 'middle', fill: '#888' }
//               }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend 
//               wrapperStyle={{ color: '#fff', fontSize: '14px' }}
//             />
//             <Line 
//               type="monotone" 
//               dataKey="dry" 
//               stroke="#E74C3C" 
//               strokeWidth={3}
//               dot={{ fill: '#E74C3C', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, stroke: '#E74C3C', strokeWidth: 2 }}
//               name="Dry Skin"
//             />
//             <Line 
//               type="monotone" 
//               dataKey="normal" 
//               stroke="#2ECC71" 
//               strokeWidth={3}
//               dot={{ fill: '#2ECC71', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, stroke: '#2ECC71', strokeWidth: 2 }}
//               name="Normal Skin"
//             />
//             <Line 
//               type="monotone" 
//               dataKey="oily" 
//               stroke="#3498DB" 
//               strokeWidth={3}
//               dot={{ fill: '#3498DB', strokeWidth: 2, r: 4 }}
//               activeDot={{ r: 6, stroke: '#3498DB', strokeWidth: 2 }}
//               name="Oily Skin"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         gap: '30px',
//         marginTop: '20px',
//         flexWrap: 'wrap'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{ 
//             width: '12px', 
//             height: '12px', 
//             backgroundColor: '#E74C3C',
//             borderRadius: '50%'
//           }} />
//           <span style={{ color: '#888', fontSize: '14px' }}>Dry Skin</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{ 
//             width: '12px', 
//             height: '12px', 
//             backgroundColor: '#2ECC71',
//             borderRadius: '50%'
//           }} />
//           <span style={{ color: '#888', fontSize: '14px' }}>Normal Skin</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <div style={{ 
//             width: '12px', 
//             height: '12px', 
//             backgroundColor: '#3498DB',
//             borderRadius: '50%'
//           }} />
//           <span style={{ color: '#888', fontSize: '14px' }}>Oily Skin</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlySkinChart;
'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cookies from 'js-cookie';

const MonthlySkinChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchMonthlySkinData();
  }, []);

  const fetchMonthlySkinData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      console.log('Fetching monthly data from:', `${process.env.NEXT_PUBLIC_URL_HOST}/skiknprogress/monthly`);
      console.log('Token:', token);

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/skinprogress/monthly`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Monthly data response:', data);
      
      if (data.success) {
        // Check if we have the expected data structure
        const monthlyProgress = data.data?.monthlyProgress || data.monthlyProgress || [];
        
        if (monthlyProgress.length === 0) {
          console.log('No monthly progress data available');
          setChartData([]);
          setLoading(false);
          return;
        }
        
        // Format data for the chart
        const formattedData = monthlyProgress.map(item => ({
          month: `${item.monthName.substring(0, 3)} ${item.year}`,
          dry: item.dry,
          normal: item.normal,
          oily: item.oily,
          analysisCount: item.analysisCount
        }));
        
        console.log('Formatted chart data:', formattedData);
        setChartData(formattedData);
      } else {
        console.error('API returned success: false', data);
        setError(data.message || 'Failed to load skin progress data');
      }
    } catch (error) {
      console.error('Error fetching monthly skin data:', error);
      setError('Failed to load skin progress data');
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #444',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <p style={{ color: '#fff', margin: '0 0 8px 0', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              color: entry.color, 
              margin: '4px 0',
              fontSize: '14px'
            }}>
              {`${entry.dataKey}: ${entry.value.toFixed(2)}%`}
            </p>
          ))}
          <p style={{ color: '#888', margin: '8px 0 0 0', fontSize: '12px' }}>
            {`${payload[0]?.payload?.analysisCount || 0} analyses`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#171717',
        borderRadius: '16px',
        padding: '40px',
        margin: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{ color: '#fff', fontSize: '16px' }}>Loading skin progress chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#171717',
        borderRadius: '16px',
        padding: '40px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{ color: '#ff6b6b', fontSize: '16px', marginBottom: '12px' }}>
          Error loading chart
        </div>
        <div style={{ color: '#888', fontSize: '14px' }}>{error}</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{
        backgroundColor: '#171717',
        borderRadius: '16px',
        padding: '40px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>
          No Skin Progress Data Yet
        </div>
        <div style={{ color: '#888', fontSize: '14px' }}>
          Complete a few skin analyses to see your progress over time
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#171717',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '30px',
      margin: '20px 0',
      color: '#fff'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          color: '#fff'
        }}>
          Monthly Skin Progress
        </h2>
        <p style={{ 
          color: '#888',
          fontSize: '14px',
          margin: '0'
        }}>
          Track your skin type distribution over time
        </p>
      </div>

      <div style={{ 
        height: isMobile ? '300px' : '400px',
        width: '100%'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="month" 
              stroke="#888"
              fontSize={12}
              tick={{ fill: '#888' }}
            />
            <YAxis 
              stroke="#888"
              fontSize={12}
              tick={{ fill: '#888' }}
              domain={[0, 100]}
              label={{ 
                value: 'Percentage (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#888' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#fff', fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="dry" 
              stroke="#E74C3C" 
              strokeWidth={3}
              dot={{ fill: '#E74C3C', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#E74C3C', strokeWidth: 2 }}
              name="Dry Skin"
            />
            <Line 
              type="monotone" 
              dataKey="normal" 
              stroke="#2ECC71" 
              strokeWidth={3}
              dot={{ fill: '#2ECC71', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2ECC71', strokeWidth: 2 }}
              name="Normal Skin"
            />
            <Line 
              type="monotone" 
              dataKey="oily" 
              stroke="#3498DB" 
              strokeWidth={3}
              dot={{ fill: '#3498DB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3498DB', strokeWidth: 2 }}
              name="Oily Skin"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#E74C3C',
            borderRadius: '50%'
          }} />
          <span style={{ color: '#888', fontSize: '14px' }}>Dry Skin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#2ECC71',
            borderRadius: '50%'
          }} />
          <span style={{ color: '#888', fontSize: '14px' }}>Normal Skin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: '#3498DB',
            borderRadius: '50%'
          }} />
          <span style={{ color: '#888', fontSize: '14px' }}>Oily Skin</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlySkinChart;