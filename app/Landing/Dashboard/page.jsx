'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AIChatbot from '../../AiChatBot/page';
import Chart from '../../Chart/page';
import Facts from '../../Facts/page';
import TakeQuiz from '../../TakeQuiz/page';
import Carousel from '../../Carousel/page';
import Calendar from '../../Calendar/page';
import OnlyGraph from '../../Graph/OnlyGraph';
import { Outfit } from "next/font/google";
import Cookies from "js-cookie";

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasAutoScrolledRef = useRef(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch user name from API
    const fetchUserName = async () => {
      try {
        setIsLoading(true);
        
        // Get token inside the effect to ensure it's fresh
        const token = Cookies.get("token");
        
        if (!token) {
          console.error('No token found');
          setUserName('Guest');
          return;
        }


        
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/userprofile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"  // Skip ngrok browser warning
          }
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        // Check if response is actually JSON
        const contentType = res.headers.get('content-type');
      
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await res.text();
          throw new Error('API returned non-JSON response');
        }

        const data = await res.json();
      
        // Check if name exists in response
        if (data && data.profile.name) {
          setUserName(data.profile.name);
        } else {
          setUserName('User');
        }

      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName('Guest');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, []); // Empty dependency array

  // Debug: Log userName changes
  useEffect(() => {
  }, [userName]);

  // Robust auto scroll effect
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    if (hasAutoScrolledRef.current) return;

    let hasUserScrolled = false;
    let timer;

    const handleScroll = () => {
      hasUserScrolled = true;
      hasAutoScrolledRef.current = true;
    };

    window.addEventListener('scroll', handleScroll, { once: true });

    timer = setTimeout(() => {
      if (hasUserScrolled || hasAutoScrolledRef.current) return;
      hasAutoScrolledRef.current = true;

      const startPosition = window.scrollY;
      const endPosition = startPosition + (isMobile ? 70 : 100);
      const duration = 2000;
      const startTime = performance.now();

      function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeInOutCubic = progress =>
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        const currentPosition =
          startPosition + (endPosition - startPosition) * easeInOutCubic(progress);
        window.scrollTo(0, currentPosition);
        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        }
      }
      // Wait for next animation frame to ensure DOM is painted
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollStep);
      });
    }, 3000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  
  // Only show correct number of days and include all weekdays
  const getCurrentCalendarData = () => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' }); // Get current month name
    // Now include all days
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let dates = [];
    // Show 10 days for mobile, 15 for desktop/tablet
    const numDays = isMobile ? 10 : 10;
    let i = 0;
    while (dates.length < numDays) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      dates.push({
        date: nextDate.getDate(),
        isToday: i === 0,
        dayIndex: nextDate.getDay(),
      });
      i++;
    }
    return { days, dates, currentMonth };
  };

  const { days, dates, currentMonth } = getCurrentCalendarData();
  
  // Chart data for the progress tracking
  const chartData = [
    { month: 'jan', value1: 5, value2: 0 },
    { month: 'mar', value1: 40, value2: 5 },
    { month: 'may', value1: 80, value2: 10 },
    { month: 'june', value1: 70, value2: 8 }
  ];

  // Mobile Layout Component
  const MobileLayout = () => (
    <div style={styles.mobileContainer}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection(isMobile)}>
        {isLoading ? (
          <div style={styles.loadingContainer(isMobile)}>
            <div style={styles.loader}></div>
            <h1 style={styles.welcomeHeading(isMobile, isTablet)}>Loading your dashboard...</h1>
          </div>
        ) : (
          <>
            <h1 style={styles.welcomeHeading(isMobile, isTablet)}>
              {`Hey ${userName}`}
            </h1>
            <p style={styles.welcomeSubheading(isMobile, isTablet)}>let's improve with oliveclear!!!</p>
            
          </>
        )}
      </div>

      {/* Facts Section - First */}
      <div style={styles.mobileFactsContainer}>
        <Link href="/facts">
          <Facts/>
        </Link>
      </div>

      {/* Grid Section - 2 left, 3 right */}
      <div style={styles.mobileGrid}>
        {/* Left Column - 2 blocks */}
        <div style={styles.mobileLeftColumn}>
          {/* Calendar */}
          <div style={styles.mobileCalendarContainer}>
            <Link href="/Calendar">
              <div style={styles.fullHeight}>
                {/* Show current month above the calendar grid */}
                <div style={{ textAlign: 'center', color: '#CEDF9F', fontWeight: 700, fontSize: isMobile ? '16px' : '18px', marginBottom: isMobile ? '3px' : '6px' }}>{currentMonth}</div>
                <div style={styles.calendarGrid(isMobile)}>
                  {/* Removed static weekday headers */}
                  {(() => {
                    // Group dates into rows of 5
                    const rows = [];
                    for (let i = 0; i < dates.length; i += 5) {
                      rows.push(dates.slice(i, i + 5));
                    }
                    return rows.map((row, rowIndex) => (
                      row.map((dateObj, colIndex) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            ...(dateObj.isToday ? { ...styles.calendarDate(isMobile), ...styles.activeDate } : styles.calendarDate(isMobile))
                          }}
                          key={`date-${rowIndex * 5 + colIndex}`}
                        >
                          <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#aaa', fontWeight: 400 }}>{days[dateObj.dayIndex]}</span>
                          <span style={{ fontSize: isMobile ? '14px' : '16px', color: dateObj.isToday ? '#CEDF9F' : '#aaa', fontWeight: dateObj.isToday ? 700 : 400 }}>{dateObj.date}</span>
                        </div>
                      ))
                    ));
                  })()}
                </div>
              </div>
            </Link>
          </div>

          {/* Progress Tracking */}
          <div style={styles.mobileProgressContainer}>
            <Link href="/Chart">
              <div>
                <div style={styles.sectionHeader2(isMobile)}>
                  <span>track your progress</span>
                </div>
                <div style={styles.chartContainer}>
                  <OnlyGraph chartData={chartData} isMobile={isMobile} />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column - 3 blocks */}
        <div style={styles.mobileRightColumn}>
          {/* Take Quiz */}
          <div style={styles.mobileTakeQuizContainer}>
            <Link href="/RetakeQuiz">
              <TakeQuiz/>
            </Link>
          </div>

          {/* Face Scan */}
          <div style={styles.mobileFaceScanContainer}>
            <Link href="/FaceScan">
              <div style={styles.faceScanText(isMobile, isTablet)}>
                face scan
                <br />for your
                <br />skin type
              </div>
            </Link>
          </div>

          {/* AI Chatbot */}
          <div style={styles.mobileAIChatbotContainer}>
            <Link href="/ChatBot">
              <AIChatbot />
            </Link>
          </div>
        </div>
      </div>

      {/* Educational Content - Last */}
      <div style={styles.mobileEducationalContainer}>
        <Link href="/Blog">
          <div>                <div style={styles.sectionHeader(isMobile)}>
                  <span>educational content</span>
                  <div style={styles.editIcon(isMobile)}>edit</div>
                </div>
            <div style={styles.carouselWrapper}>
              <Carousel />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );

  // Desktop Layout Component
  const DesktopLayout = () => (
    <div style={styles.mainWrapper(isMobile, isTablet)}>
      {/* Welcome text */}
      <div style={styles.welcomeSection(isMobile)}>
        <h1 style={styles.welcomeHeading(isMobile, isTablet)}>
          {isLoading ? 'Loading...' : `Hey ${userName},`}
        </h1>
        <p style={styles.welcomeSubheading(isMobile, isTablet)}>let's improve with oliveclear!!!</p>
      </div>
      
      <div style={styles.container(isMobile, isTablet)}>
        {/* Column 1: AI Chatbot */}
        <div style={styles.column(isMobile)}>
          <AIChatbot />
        </div>

        {/* Column 2: Educational Content and Progress Tracking */}
        <div style={styles.column(isMobile)}>
          {/* Educational Content */}
          <div style={styles.educationalContainer(isMobile)}>
            <Link href="/Blog">
              <div>
                <div style={styles.sectionHeader(isMobile)}>
                  <span>educational content</span>
                  <div style={styles.editIcon(isMobile)}>edit</div>
                </div>
                <div style={styles.carouselWrapper}>
                  <Carousel />
                </div>
              </div>
            </Link>
          </div>
          
          {/* Progress Tracking */}
          <div style={styles.progressContainer(isMobile)}>
            <Link href="/Chart">
              <div>
                <div style={styles.sectionHeader2(isMobile)}>
                  <span>track your progress</span>
                </div>
                <div style={styles.chartContainer}>
                  <OnlyGraph isMobile={isMobile} />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Column 3: Calendar, Face Scan, Facts, and Quiz */}
        <div style={styles.column(isMobile)}>
          {/* Calendar Widget */}
          <div style={styles.calendarContainer(isMobile)}>
            <Link href="/Calendar">
              <div style={styles.fullHeight}>
                {/* Show current month above the calendar grid */}
                <div style={{ textAlign: 'center', color: '#CEDF9F', fontWeight: 700, fontSize: isMobile ? '18px' : '22px', marginBottom: '0px' }}>{currentMonth}</div>
                <div style={styles.calendarGrid(isMobile)}>
                  {/* Removed static weekday headers */}
                  {(() => {
                    // Group dates into rows of 5
                    const rows = [];
                    for (let i = 0; i < dates.length; i += 5) {
                      rows.push(dates.slice(i, i + 5));
                    }
                    return rows.map((row, rowIndex) => (
                      row.map((dateObj, colIndex) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            ...(dateObj.isToday ? { ...styles.calendarDate(isMobile), ...styles.activeDate } : styles.calendarDate(isMobile))
                          }}
                          key={`date-${rowIndex * 5 + colIndex}`}
                        >
                          <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#aaa', fontWeight: 400 }}>{days[dateObj.dayIndex]}</span>
                          <span style={{ fontSize: isMobile ? '14px' : '16px', color: dateObj.isToday ? '#CEDF9F' : '#aaa', fontWeight: dateObj.isToday ? 700 : 400 }}>{dateObj.date}</span>
                        </div>
                      ))
                    ));
                  })()}
                </div>
              </div>
            </Link>
          </div>
          
          {/* Face Scan */}
          <div style={styles.faceScanContainer(isMobile)}>
            <Link href="/FaceScan">
              <div style={styles.faceScanText(isMobile, isTablet)}>
                face scan
                <br /><span style={{ color: '#797E86' }}>for your</span>
                <br />skin type
              </div>
            </Link>
          </div>
        
          <Link href="/RetakeQuiz">
            <div style={styles.weeklyQuizButton(isMobile)}>
              <TakeQuiz/>
            </div>
          </Link>

          {/* Facts */}
          <div style={styles.factsContainer(isMobile)}>
            <Link href="/facts">
              <Facts/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </>
  );
};

// Styles with responsive functions
const styles = {
  mainWrapper: (isMobile, isTablet) => ({
    backgroundColor: '#171717',
    color: '#e0e0e0',
    width: '100%',
    fontFamily: outfit.style.fontFamily,
    marginLeft: isMobile ? '0' : isTablet ? '60px' : '170px',
    marginTop: isMobile ? '60px' : isTablet ? '80px' : '100px',
    height: '100vh',
    paddingBottom: isMobile ? '20px' : '0',

    overflowY: 'unset', // Allow vertical scrolling on mobile
    // overflowY: isMobile ? 'auto' : isTablet ? 'auto' : 'auto',
    // overflowX: 'hidden', // Prevent horizontal overflow on mobile
  }),
  
  // Mobile-specific styles
  mobileContainer: {
    backgroundColor: '#171717',
    color: '#e0e0e0',
    width: '100%',
    fontFamily: outfit.style.fontFamily,
    marginTop: '70px',
    minHeight: '100dvh',
    paddingBottom: '20px',
    // marginBottom: '20px',
  },
  
  mobileFactsContainer: {
    backgroundColor: '#2f2f2f',
    borderRadius: '20px',
    padding: '12px',
    margin: '16px',
    maxHeight: '120px', // Use minHeight instead of height
    overflow: 'hidden', // Optionally add this to clip overflow
    // height: '112px',
  },
  
  mobileGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    margin: '16px',
    marginBottom: '16px',
    
  },
  
  mobileLeftColumn: {
    // width: 'calc(100% + 15%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  
  mobileRightColumn: {
    // marginLeft: '30px',
    // width: '190px',
    // width: 'calc(100% - 27%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  mobileCalendarContainer: {
    backgroundColor: '#2f2f2f',
    borderRadius: '20px',
    padding: '12px',
    paddingTop: '8px',
    height: '130px',
  },
  
  mobileProgressContainer: {
    backgroundColor: '#2f2f2f',
    borderRadius: '20px',
    padding: '16px',
    height: '135px',
  },
  
  mobileTakeQuizContainer: {
    backgroundColor: '#2f2f2f',
    // backgroundColor: '#222',
    borderRadius: '20px',
    padding: '12px',
    height: '70px',
  },
  
  mobileFaceScanContainer: {
    backgroundColor: '#BDC5D3',
    borderRadius: '20px',
    padding: '12px',
    height: '103px',
    display: 'flex',
    alignItems: 'center',
  },
  
  mobileAIChatbotContainer: {
    // backgroundColor: '#2f2f2f',
    borderRadius: '20px',
    padding: '0px',
    height: '86px',
  },
  
  mobileEducationalContainer: {
    backgroundColor: '#2f2f2f',
    borderRadius: '20px',
    padding: '16px',
    margin: '16px',
    minHeight: '200px',
  },
  
  welcomeSection: (isMobile) => ({
    padding: isMobile ? '12px 16px 0' : '12px 24px 0',
  }),
  welcomeHeading: (isMobile, isTablet) => ({
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
    fontWeight: 600,
    margin: 0,
    color: '#ffffff',
  }),
  welcomeSubheading: (isMobile, isTablet) => ({
    fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
    fontWeight: 400,
    margin: '4px 0 2px',
    color: '#aaaaaa',
  }),
  container: (isMobile, isTablet) => ({
    width: isMobile ? 'calc(100% - 32px)' : isTablet ? 'calc(100% - 120px)' : 'calc(100% - 200px)',
    height: isMobile ? 'auto' : 'calc(100vh - 100px)',
    backgroundColor: '#171717',
    color: '#e0e0e0',
    padding: isMobile ? '8px 16px' : '16px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    fontFamily: outfit.style.fontFamily,
    gap: isMobile ? '16px' : '0',
  }),
  column: (isMobile) => ({
    width: isMobile ? '100%' : '33.333%',
    height: isMobile ? 'auto' : '100%',
    padding: isMobile ? '0' : '0 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  }),
  educationalContainer: (isMobile) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '20px' : '35px',
    padding: isMobile ? '16px' : '20px 20px',
    flex: isMobile ? 'none' : '1',
    marginBottom: isMobile ? '0' : '16px',
    minHeight: isMobile ? '200px' : 'auto',
  }),
  progressContainer: (isMobile) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '20px' : '35px',
    padding: isMobile ? '16px 20px' : '22px 37px',
    flex: isMobile ? 'none' : '1',
    minHeight: isMobile ? '200px' : 'auto',
  }),
  sectionHeader: (isMobile) => ({
    display: 'flex',
    position: 'relative',
    marginLeft: isMobile ? '8px' : "16px",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  }),
  sectionHeader2: (isMobile) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? '15px' : '20px',
  }),
  editIcon: (isMobile) => ({
    cursor: 'pointer',
    fontSize: isMobile ? '16px' : '18px',
  }),
  carouselWrapper: {
    height: '35%',
    position: 'relative',
    overflow: 'hidden',
  },
  calendarContainer: (isMobile) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '20px' : '35px',
    padding: isMobile ? '12px' : '16px',
    paddingTop: isMobile ? '12px' : '10px',
    flex: isMobile ? 'none' : '1',
    marginBottom: isMobile ? '0' : '10px',
    minHeight: isMobile ? '180px' : 'auto',
  }),
  fullHeight: {
    height: '100%',
  },
  calendarGrid: (isMobile) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // 5 columns for design
    gap: isMobile ? '3px' : '5px',
  }),
  calendarDay: (isMobile) => ({
    textAlign: 'center',
    padding: isMobile ? '3px' : '5px',
    fontSize: isMobile ? '10px' : '12px',
    color: '#aaa',
  }),
  calendarDate: (isMobile) => ({
    textAlign: 'center',
    color: '#aaa',
    padding: isMobile ? '3px' : '5px',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 400, 
  }),
  activeDate: {
    color: '#CEDF9F',
    borderRadius: '12px',
    border: '2px solid #CEDF9F',
    fontWeight: 600,
    textAlign: 'center',
  },
  faceScanContainer: (isMobile) => ({
    backgroundColor: '#BDC5D3',
    borderRadius: isMobile ? '20px' : '35px',
    padding: isMobile ? '16px' : '20px',
    flex: isMobile ? 'none' : '1',
    display: 'flex',
    alignItems: 'center',
    marginBottom: isMobile ? '0' : '10px',
    minHeight: isMobile ? '160px' : 'auto',
  }),
  faceScanText: (isMobile, isTablet) => ({
    fontSize: isMobile ? '27px' : isTablet ? '36px' : '48px',
    fontWeight: 800,
    color: '#3F4041',
    lineHeight: isMobile ? '25px' : isTablet ? '34px' : '45px',
    letterSpacing: '-1px',
    fontFamily: outfit.style.fontFamily,
    fontStyle: 'normal',
    textAlign: 'left',
    paddingLeft: isMobile ? '5px' : '12px',
  }),
  weeklyQuizButton: (isMobile) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '20px' : '35px',
    padding: isMobile ? '16px' : '19px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    minHeight: isMobile ? '80px' : 'auto',
  }),
  loadingContainer: (isMobile) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: isMobile ? '20px' : '32px',
  }),
  loader: {
    width: '40px',
    height: '40px',
    border: '4px solid #2f2f2f',
    borderTop: '4px solid #CEDF9F',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  tutorialHint: (isMobile) => ({
    backgroundColor: 'rgba(206, 223, 159, 0.1)',
    color: '#CEDF9F',
    padding: isMobile ? '8px 12px' : '10px 16px',
    borderRadius: '20px',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '500',
    marginTop: '12px',
    border: '1px solid rgba(206, 223, 159, 0.3)',
    textAlign: 'center',
  }),
  factsContainer: (isMobile) => ({
    backgroundColor: '#2f2f2f',
    borderRadius: isMobile ? '20px' : '35px',
    padding: isMobile ? '12px' : '15px',
    flex: isMobile ? 'none' : '1',
    marginBottom: isMobile ? '0' : '16px',
    minHeight: isMobile ? '120px' : 'auto',
  }),
  chartContainer: {
    height: '70%',
  },
  chartLabel: {
    fill: '#aaa',
    fontSize: '12px',
  },
  chartLine1: {
    fill: 'none',
    stroke: '#aacf44',
    strokeWidth: '2',
  },
  chartLine2: {
    fill: 'none',
    stroke: '#444',
    strokeWidth: '2',
  },
};

export default Dashboard;