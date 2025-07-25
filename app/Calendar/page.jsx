'use client';
import { useState, useEffect } from 'react';
import { Outfit } from "next/font/google";
import Cookies from 'js-cookie';
const token = Cookies.get('token');

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

const Calendar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });
  const [userGender, setUserGender] = useState('');
  const [periodData, setPeriodData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userGender === 'female') {
      fetchPeriodData();
    } else {
      setLoading(false);
    }
  }, [userGender]);

  const fetchUserProfile = async () => {
    try {
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/userprofile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      if (data.success) {
        setUserGender(data.profile.gender);
      }
    } catch (error) {
      setError('Failed to load user profile');
    }
  };

  const fetchPeriodData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/calendar/periods`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      if (data.success) {
        setPeriodData(data.periodData);
        setInsights(data.periodData?.insights);
      } else {
        setError(data.message || 'Failed to load period data');
      }
    } catch (error) {
      setError('Failed to load period data');
    } finally {
      setLoading(false);
    }
  };

  // Calendar grid logic
  const getMonthCalendarData = (month, year) => {
    const today = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDays = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();
    const dates = [];
    for (let i = 0; i < startDay; i++) dates.push(null);
    for (let d = 1; d <= numDays; d++) {
      dates.push({
        date: d,
        fullDate: new Date(year, month, d),
        isToday:
          d === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear(),
      });
    }
    return { days, dates };
  };

  const { days, dates } = getMonthCalendarData(displayedMonth.month, displayedMonth.year);

  // Navigation
  const goToPrevMonth = () => {
    setDisplayedMonth(prev => {
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      return { month: newMonth, year: newYear };
    });
  };
  const goToNextMonth = () => {
    setDisplayedMonth(prev => {
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      return { month: newMonth, year: newYear };
    });
  };

  // Helper: format yyyy-mm-dd
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Cell coloring for period/ovulation/fertile
  const getDateStyle = (dateObj, selectedDate, isMobile) => {
    if (!dateObj) return styles.calendarDate(isMobile);
    let baseStyle = { ...styles.calendarDate(isMobile) };
    const dateStr = formatDate(dateObj.fullDate);
    if (periodData) {
      if (periodData.periods && periodData.periods.includes(dateStr)) {
        baseStyle = {
          ...baseStyle,
          border: '2px solid #ff6b6b', // Red border for period days
          backgroundColor: 'transparent', // No background color
          color: '#fff',
        };
      } else if (periodData.ovulationDates && periodData.ovulationDates.includes(dateStr)) {
        baseStyle = { ...baseStyle, backgroundColor: '#51cf66', color: '#fff' };
      } else if (periodData.fertileDays && periodData.fertileDays.includes(dateStr)) {
        baseStyle = { ...baseStyle, backgroundColor: '#ffc9c9', color: '#333' };
      }
    }
    if (dateObj.isToday) baseStyle = { ...baseStyle, ...styles.todayDate };
    if (
      selectedDate &&
      selectedDate.date === dateObj.date &&
      selectedDate.fullDate.getTime() === dateObj.fullDate.getTime()
    ) {
      baseStyle = { ...baseStyle, ...styles.selectedDate };
    }
    return baseStyle;
  };

  // Insights date formatting
  const formatInsightDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.pageContainer(isMobile, isTablet)}>
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <div style={{ width: 40, height: 40, border: '4px solid #333', borderTop: '4px solid #CEDF9F', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
          <p>Loading calendar...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer(isMobile, isTablet)}>
      <div style={styles.headerSection}>
        <h1 style={styles.pageTitle(isMobile, isTablet)}>Calendar</h1>
        {userGender === 'female' && periodData && (
          <p style={styles.pageSubtitle(isMobile, isTablet)}>
            Period tracking enabled
          </p>
        )}
      </div>

      {error && (
        <div style={{ background: '#ff6b6b', color: '#fff', borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <p>{error}</p>
          <button onClick={fetchPeriodData} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: 4, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      )}

      <div style={styles.calendarWrapper(isMobile, isTablet)}>
        <div style={styles.calendarContainer(isMobile, isTablet)}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <button onClick={goToPrevMonth} style={{...styles.arrowButton, marginRight: 8}}>&lt;</button>
            <button onClick={goToNextMonth} style={{...styles.arrowButton, marginLeft: 8}}>&gt;</button>
          </div>
          <div style={styles.calendarHeader}>
            <h2 style={styles.calendarTitle(isMobile)}>
              {new Date(displayedMonth.year, displayedMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div style={styles.calendarGrid(isMobile)}>
            {days.map((day, index) => (
              <div style={styles.calendarDay(isMobile)} key={`day-${index}`}>
                {day}
              </div>
            ))}
            {dates.map((dateObj, index) => (
              <div
                style={dateObj && dateObj.fullDate < new Date(new Date().setHours(0,0,0,0))
                  ? { ...getDateStyle(dateObj, selectedDate, isMobile), color: '#888', opacity: 0.5 }
                  : getDateStyle(dateObj, selectedDate, isMobile)
                }
                key={`date-${index}`}
                onClick={() => dateObj && setSelectedDate(dateObj)}
              >
                {dateObj ? dateObj.date : ''}
              </div>
            ))}
          </div>
        </div>
        {/* Selected Date Info */}
        {selectedDate && (
          <div style={styles.selectedDateInfo(isMobile, isTablet)}>
            <h3 style={styles.selectedDateTitle(isMobile)}>Selected Date</h3>
            <p style={styles.selectedDateText(isMobile)}>
              {selectedDate.fullDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div style={styles.appointmentSection}>
              <h4 style={styles.appointmentTitle(isMobile)}>Appointments & Reminders</h4>
              <div style={styles.appointmentPlaceholder(isMobile)}>
                No appointments scheduled for this date
              </div>
              <button style={styles.addButton(isMobile)}>
                + Add Appointment
              </button>
            </div>
            {/* Period info for selected date */}
            {userGender === 'female' && periodData && (
              <div style={{ marginTop: 24 }}>
                {periodData.periods && periodData.periods.includes(formatDate(selectedDate.fullDate)) && (
                  <div style={{ color: '#ff6b6b', fontWeight: 600 }}>Period Day</div>
                )}
                {periodData.ovulationDates && periodData.ovulationDates.includes(formatDate(selectedDate.fullDate)) && (
                  <div style={{ color: '#51cf66', fontWeight: 600 }}>Ovulation Day</div>
                )}
                {periodData.fertileDays && periodData.fertileDays.includes(formatDate(selectedDate.fullDate)) && (
                  <div style={{ color: '#ffc9c9', fontWeight: 600 }}>Fertile Window</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div style={styles.quickActions(isMobile, isTablet)}>
        <div style={styles.actionCard(isMobile)}>
          <h3 style={styles.actionTitle(isMobile)}>Today's Routine</h3>
          <p style={styles.actionDescription(isMobile)}>
            Morning & evening skincare checklist
          </p>
        </div>
        <div style={styles.actionCard(isMobile)}>
          <h3 style={styles.actionTitle(isMobile)}>Upcoming</h3>
          <p style={styles.actionDescription(isMobile)}>
            Next dermatologist appointment
          </p>
        </div>
        <div style={styles.actionCard(isMobile)}>
          <h3 style={styles.actionTitle(isMobile)}>Progress</h3>
          <p style={styles.actionDescription(isMobile)}>
            Weekly skin improvement photos
          </p>
        </div>
      </div>

      {/* Period Tracking Sections - Moved to Bottom */}
      {userGender === 'female' && insights && (
        <div style={{ background: '#2f2f2f', borderRadius: isMobile ? 16 : 20, padding: isMobile ? 20 : 24, marginTop: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Cycle Insights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 14, color: '#aaa', fontWeight: 500 }}>Current Phase:</span>
              <span style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{insights.currentPhase.charAt(0).toUpperCase() + insights.currentPhase.slice(1)}</span>
            </div>
            {insights.daysUntilNextPeriod && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 14, color: '#aaa', fontWeight: 500 }}>Next Period:</span>
                <span style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{insights.daysUntilNextPeriod} days ({formatInsightDate(insights.nextPeriodDate)})</span>
              </div>
            )}
            {insights.daysUntilOvulation && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 14, color: '#aaa', fontWeight: 500 }}>Next Ovulation:</span>
                <span style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{insights.daysUntilOvulation} days ({formatInsightDate(insights.nextOvulationDate)})</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 14, color: '#aaa', fontWeight: 500 }}>Fertile Window:</span>
              <span style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{insights.isInFertileWindow ? 'Currently fertile' : 'Not fertile'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {userGender === 'female' && periodData && (
        <div style={{ background: '#2f2f2f', borderRadius: isMobile ? 16 : 20, padding: isMobile ? 16 : 20, marginBottom: 24 }}>
          <h4 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#fff', margin: '0 0 12px' }}>Legend</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#e0e0e0' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff6b6b', marginRight: 4, display: 'inline-block' }}></div>
              <span>Period Days</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#e0e0e0' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#51cf66', marginRight: 4, display: 'inline-block' }}></div>
              <span>Ovulation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#e0e0e0' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffc9c9', marginRight: 4, display: 'inline-block' }}></div>
              <span>Fertile Window</span>
            </div>
          </div>
        </div>
      )}

      {/* Period Data Summary Card for Female Users */}
      {userGender === 'female' && periodData && (
        <div style={{ background: '#232323', borderRadius: isMobile ? 16 : 20, padding: isMobile ? 20 : 24, marginBottom: 24, color: '#fff' }}>
          <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 600, margin: '0 0 16px' }}>Your Cycle Details</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ minWidth: 120 }}>
              <span style={{ color: '#aaa', fontSize: 14 }}>Last Period Start:</span><br />
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                {periodData.lastPeriodDate ? new Date(periodData.lastPeriodDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
            <div style={{ minWidth: 120 }}>
              <span style={{ color: '#aaa', fontSize: 14 }}>Cycle Length:</span><br />
              <span style={{ fontWeight: 600, fontSize: 16 }}>{periodData.cycleLength || 'N/A'} days</span>
            </div>
            <div style={{ minWidth: 120 }}>
              <span style={{ color: '#aaa', fontSize: 14 }}>Period Duration:</span><br />
              <span style={{ fontWeight: 600, fontSize: 16 }}>{periodData.periodLastsFor || 'N/A'} days</span>
            </div>
            <div style={{ minWidth: 120 }}>
              <span style={{ color: '#aaa', fontSize: 14 }}>Period Type:</span><br />
              <span style={{ fontWeight: 600, fontSize: 16 }}>{periodData.periodType ? periodData.periodType.charAt(0).toUpperCase() + periodData.periodType.slice(1) : 'N/A'}</span>
            </div>
            <div style={{ minWidth: 120 }}>
              <span style={{ color: '#aaa', fontSize: 14 }}>Next Ovulation:</span><br />
              <span style={{ fontWeight: 600, fontSize: 16 }}>{periodData.insights?.nextOvulationDate ? new Date(periodData.insights.nextOvulationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
            </div>
            <div style={{ minWidth: 120 }}>
              <span style={{ color: '#aaa', fontSize: 14 }}>Next Period:</span><br />
              <span style={{ fontWeight: 600, fontSize: 16 }}>{periodData.insights?.nextPeriodDate ? new Date(periodData.insights.nextPeriodDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  pageContainer: (isMobile, isTablet) => ({
    backgroundColor: '#171717',
    color: '#e0e0e0',
    minHeight: '100vh',
    fontFamily: outfit.style.fontFamily,
    marginLeft: isMobile ? '0' : isTablet ? '60px' : '170px',
    marginTop: isMobile ? '60px' : isTablet ? '80px' : '70px',
    padding: isMobile ? '16px' : '24px',
  }),

  headerSection: {
    marginBottom: '20px',
  },

  pageTitle: (isMobile, isTablet) => ({
    fontSize: isMobile ? '28px' : isTablet ? '32px' : '36px',
    fontWeight: 700,
    margin: 0,
    color: '#ffffff',
  }),

  pageSubtitle: (isMobile, isTablet) => ({
    fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
    fontWeight: 400,
    margin: '8px 0 0',
    color: '#aaaaaa',
  }),

  calendarWrapper: (isMobile, isTablet) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
    gap: isMobile ? '24px' : '32px',
    marginBottom: '32px',
  }),

  calendarContainer: (isMobile, isTablet) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '20px' : '24px',
    padding: isMobile ? '20px' : '32px',
  }),

  calendarHeader: {
    marginBottom: '24px',
  },

  calendarTitle: (isMobile) => ({
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    color: '#ffffff',
    margin: 0,
  }),

  calendarGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: isMobile ? '8px' : '12px',
  }),

  calendarDay: (isMobile) => ({
    textAlign: 'center',
    padding: isMobile ? '8px 4px' : '12px 8px',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 600,
    color: '#aaa',
    borderBottom: '1px solid #444',
    marginBottom: '8px',
  }),

  calendarDate: (isMobile) => ({
    textAlign: 'center',
    padding: isMobile ? '12px 8px' : '16px 12px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 400,
    color: '#e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#444',
    },
  }),

  todayDate: {
    color: '#CEDF9F',
    backgroundColor: 'rgba(206, 223, 159, 0.1)',
    border: '2px solid #CEDF9F',
    fontWeight: 700,
  },

  selectedDate: {
    backgroundColor: '#CEDF9F',
    color: '#171717',
    fontWeight: 700,
  },

  selectedDateInfo: (isMobile, isTablet) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '20px' : '24px',
    padding: isMobile ? '20px' : '32px',
  }),

  selectedDateTitle: (isMobile) => ({
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 12px',
  }),

  selectedDateText: (isMobile) => ({
    fontSize: isMobile ? '14px' : '16px',
    color: '#aaaaaa',
    margin: '0 0 24px',
  }),

  appointmentSection: {
    borderTop: '1px solid #444',
    paddingTop: '20px',
  },

  appointmentTitle: (isMobile) => ({
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 16px',
  }),

  appointmentPlaceholder: (isMobile) => ({
    fontSize: isMobile ? '14px' : '16px',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: '16px',
  }),

  addButton: (isMobile) => ({
    backgroundColor: '#CEDF9F',
    color: '#171717',
    border: 'none',
    borderRadius: '8px',
    padding: isMobile ? '10px 16px' : '12px 20px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: outfit.style.fontFamily,
  }),

  quickActions: (isMobile, isTablet) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '16px' : '24px',
  }),

  actionCard: (isMobile) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '16px' : '20px',
    padding: isMobile ? '16px' : '24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#3f3f3f',
    },
  }),

  actionTitle: (isMobile) => ({
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 8px',
  }),

  actionDescription: (isMobile) => ({
    fontSize: isMobile ? '13px' : '14px',
    color: '#aaaaaa',
    margin: 0,
  }),

  arrowButton: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#CEDF9F',
    },
  },
};

export default Calendar;