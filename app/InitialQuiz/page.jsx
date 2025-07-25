"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Add CSS animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);
}

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: '#171717',
    color: '#ffffff',
    zIndex: 1005, // Ensure it overlays correctly
    marginLeft: '155px',
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#374151',
    height: '4px'
  },
  progressFill: {
    backgroundColor: '#ffffff',
    height: '4px',
    transition: 'all 0.3s ease'
  },
  contentContainer: {
    maxWidth: '100%',
    // margin: '0 auto',
    

    padding: '32px 16px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  errorMessage: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    border: '1px solid #dc2626',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '24px'
  },
  questionContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px'
  },
  backButton: {
    padding: '12px 24px',
    borderRadius: '9999px',
    border: '1px solid',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    backgroundColor: 'transparent'
  },
  backButtonActive: {
    borderColor: '#ffffff',
    color: '#ffffff'
  },
  backButtonDisabled: {
    borderColor: '#4b5563',
    color: '#4b5563',
    cursor: 'not-allowed'
  },
  backButtonHover: {
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  pageCounter: {
    textAlign: 'center'
  },
  pageCounterText: {
    color: '#9ca3af',
    fontSize: '14px'
  },
  nextButton: {
    padding: '12px 24px',
    borderRadius: '9999px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none'
  },
  nextButtonActive: {
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  nextButtonDisabled: {
    backgroundColor: '#4b5563',
    color: '#9ca3af',
    cursor: 'not-allowed'
  },
  nextButtonHover: {
    backgroundColor: '#e5e7eb'
  }
};

export default function InitialQuiz() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [quizData, setQuizData] = useState({
    personalInfo: {},
    skinInfo: {},
    lifestyleInfo: {},
    dietInfo: {},
    menstrualInfo: {},
    goals: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userGender, setUserGender] = useState("");

  const totalPages = 12;

  // Check authentication
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Check if quiz is already completed
    checkQuizStatus();
  }, [router]);

  const checkQuizStatus = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/status`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token is invalid, redirect to login
        Cookies.remove("token");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        console.error("Error checking quiz status:", response.status);
        return;
      }

      const data = await response.json();
      
      if (data.data?.quizCompleted) {
        setCurrentPage(getActualTotalPages() + 1); // Go to tutorial if quiz is done
      }
    } catch (error) {
      console.error("Error checking quiz status:", error);
    }
  };

  const handleAnswer = (section, field, value) => {
    setQuizData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Store gender for conditional questions
    if (field === 'gender') {
      setUserGender(value);
    }
  };

  const handleNext = () => {
    const actualTotalPages = getActualTotalPages();
    if (currentPage < actualTotalPages) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === actualTotalPages) {
      setCurrentPage(actualTotalPages + 1); // Go to tutorial
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    // Validate required fields before submission
    const requiredFields = {
      'personalInfo.dateOfBirth': quizData.personalInfo?.dateOfBirth,
      'personalInfo.gender': quizData.personalInfo?.gender,
      'personalInfo.occupation': quizData.personalInfo?.occupation,
      'skinInfo.skinType': quizData.skinInfo?.skinType,
      'skinInfo.skinSensitivity': quizData.skinInfo?.skinSensitivity,
      'skinInfo.skinConcerns': quizData.skinInfo?.skinConcerns,
      'lifestyleInfo.stressLevel': quizData.lifestyleInfo?.stressLevel,
      'lifestyleInfo.sleepHours': quizData.lifestyleInfo?.sleepHours,
      'lifestyleInfo.waterIntake': quizData.lifestyleInfo?.waterIntake,
      'dietInfo.junkFoodFrequency': quizData.dietInfo?.junkFoodFrequency,
      'dietInfo.sugarIntake': quizData.dietInfo?.sugarIntake,
      'goals.primaryGoals': quizData.goals?.primaryGoals,
      'goals.timeExpectation': quizData.goals?.timeExpectation
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please complete all required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    // Add required fields that might be missing
    const submissionData = {
      personalInfo: {
        dateOfBirth: quizData.personalInfo?.dateOfBirth,
        gender: quizData.personalInfo?.gender,
        occupation: quizData.personalInfo?.occupation || "Not specified"
      },
      skinInfo: {
        skinType: quizData.skinInfo?.skinType,
        skinSensitivity: quizData.skinInfo?.skinSensitivity,
        skinConcerns: quizData.skinInfo?.skinConcerns || [],
        currentSkincarRoutine: quizData.skinInfo?.currentSkincarRoutine || "none",
        allergies: quizData.skinInfo?.allergies || ""
      },
      lifestyleInfo: {
        stressLevel: quizData.lifestyleInfo?.stressLevel,
        sleepHours: quizData.lifestyleInfo?.sleepHours,
        waterIntake: quizData.lifestyleInfo?.waterIntake,
        exerciseFrequency: quizData.lifestyleInfo?.exerciseFrequency || "never",
        sunExposure: quizData.lifestyleInfo?.sunExposure || "minimal",
        smokingStatus: quizData.lifestyleInfo?.smokingStatus || "never"
      },
      dietInfo: {
        dietType: quizData.dietInfo?.dietType || "mixed",
        junkFoodFrequency: quizData.dietInfo?.junkFoodFrequency,
        dairyIntake: quizData.dietInfo?.dairyIntake || "moderate",
        sugarIntake: quizData.dietInfo?.sugarIntake,
        fruitVeggieIntake: quizData.dietInfo?.fruitVeggieIntake || "2-3"
      },
      goals: {
        primaryGoals: quizData.goals?.primaryGoals || [],
        timeExpectation: quizData.goals?.timeExpectation
      }
    };

    // Add menstrual info for female users
    if (userGender === 'female' && quizData.menstrualInfo) {
      submissionData.menstrualInfo = {
        hasRegularCycle: quizData.menstrualInfo.hasRegularCycle,
        skinChangesWithCycle: quizData.menstrualInfo.skinChangesWithCycle
      };
    }

    console.log('Submitting quiz data:', submissionData);

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(submissionData)
      });

      if (response.status === 401) {
        // Token is invalid, redirect to login
        Cookies.remove("token");
        router.replace("/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Cache the quiz completion status
        localStorage.setItem("quizCompleted", "true");
        setCurrentPage(getActualTotalPages() + 1); // Go to tutorial
      } else {
        console.error('Quiz submission error:', data);
        setError(data.error || data.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate actual total pages based on gender
  const getActualTotalPages = () => {
    return userGender === 'female' ? 12 : 11;
  };

  // Render logic
  const renderCurrentPage = () => {
    if (currentPage === 0) return <WelcomePage onStart={() => setCurrentPage(1)} />;
    if (currentPage === getActualTotalPages() + 1) return <TutorialPage onFinish={() => router.replace("/")} />;
    switch (currentPage) {
      case 1:
        return <DateOfBirthPage quizData={quizData} onAnswer={handleAnswer} />;
      case 2:
        return <GenderPage quizData={quizData} onAnswer={handleAnswer} />;
      case 3:
        return <OccupationPage quizData={quizData} onAnswer={handleAnswer} />;
      case 4:
        return <SkinTypePage quizData={quizData} onAnswer={handleAnswer} />;
      case 5:
        return <SkinSensitivityPage quizData={quizData} onAnswer={handleAnswer} />;
      case 6:
        return <SkinConcernsPage quizData={quizData} onAnswer={handleAnswer} />;
      case 7:
        return <LifestylePage quizData={quizData} onAnswer={handleAnswer} />;
      case 8:
        return <DietPage quizData={quizData} onAnswer={handleAnswer} />;
      case 9:
        return userGender === 'female' ? <MenstrualPage quizData={quizData} onAnswer={handleAnswer} /> : <GoalsPage quizData={quizData} onAnswer={handleAnswer} />;
      case 10:
        return userGender === 'female' ? <GoalsPage quizData={quizData} onAnswer={handleAnswer} /> : <TimelinePage quizData={quizData} onAnswer={handleAnswer} />;
      case 11:
        return userGender === 'female' ? <TimelinePage quizData={quizData} onAnswer={handleAnswer} /> : <ReviewPage quizData={quizData} />;
      case 12:
        return userGender === 'female' ? <ReviewPage quizData={quizData} /> : null;
      default:
        return null;
    }
  };

  const isCurrentPageValid = () => {
    switch (currentPage) {
      case 1:
        return quizData.personalInfo?.dateOfBirth;
      case 2:
        return quizData.personalInfo?.gender;
      case 3:
        return quizData.personalInfo?.occupation;
      case 4:
        return quizData.skinInfo?.skinType;
      case 5:
        return quizData.skinInfo?.skinSensitivity;
      case 6:
        return quizData.skinInfo?.skinConcerns && quizData.skinInfo.skinConcerns.length > 0;
      case 7:
        return quizData.lifestyleInfo?.stressLevel && 
               quizData.lifestyleInfo?.sleepHours && 
               quizData.lifestyleInfo?.waterIntake &&
               quizData.lifestyleInfo?.exerciseFrequency;
      case 8:
        return quizData.dietInfo?.dietType && 
               quizData.dietInfo?.junkFoodFrequency && 
               quizData.dietInfo?.sugarIntake;
      case 9:
        if (userGender === 'female') {
          return quizData.menstrualInfo?.hasRegularCycle !== undefined;
        }
        return quizData.goals?.primaryGoals && quizData.goals.primaryGoals.length > 0;
      case 10:
        if (userGender === 'female') {
          return quizData.goals?.primaryGoals && quizData.goals.primaryGoals.length > 0;
        }
        return quizData.goals?.timeExpectation;
      case 11:
        if (userGender === 'female') {
          return quizData.goals?.timeExpectation;
        }
        return true; // Review page doesn't need validation
      case 12:
        return true; // Review page doesn't need validation
      default:
        return true;
    }
  };

  return (
    <div style={styles.container}>
      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${(currentPage / getActualTotalPages()) * 100}%`
          }}
        />
      </div>

      <div style={styles.contentContainer}>
        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Current Question */}
        <div style={styles.questionContainer}>
          {renderCurrentPage()}
        </div>

        {/* Navigation */}
        <div style={styles.navigationContainer}>
          <button
            onClick={handleBack}
            disabled={currentPage === 0}
            style={{
              ...styles.backButton,
              ...(currentPage === 0 ? styles.backButtonDisabled : styles.backButtonActive)
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 0) {
                Object.assign(e.target.style, styles.backButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 0) {
                Object.assign(e.target.style, styles.backButtonActive);
              }
            }}
          >
            ← back
          </button>

          <div style={styles.pageCounter}>
            <p style={styles.pageCounterText}>
              pages: {currentPage}/{getActualTotalPages()}
            </p>
          </div>

          <button
            onClick={currentPage === getActualTotalPages() ? handleSubmit : handleNext}
            disabled={isLoading || !isCurrentPageValid()}
            style={{
              ...styles.nextButton,
              ...(isLoading || !isCurrentPageValid() ? styles.nextButtonDisabled : styles.nextButtonActive)
            }}
            onMouseEnter={(e) => {
              if (!isLoading && isCurrentPageValid()) {
                Object.assign(e.target.style, styles.nextButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && isCurrentPageValid()) {
                Object.assign(e.target.style, styles.nextButtonActive);
              }
            }}
          >
            {isLoading 
              ? 'Submitting...' 
              : currentPage === getActualTotalPages() 
                ? 'Complete Quiz' 
                : 'next →'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// Individual Page Components
function DateOfBirthPage({ quizData, onAnswer }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    // Default to selected month or today
    const selected = quizData.personalInfo.dateOfBirth
      ? new Date(quizData.personalInfo.dateOfBirth)
      : new Date();
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const inputRef = useRef(null);

  const dateStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '32px'
    },
    inputContainer: {
      display: 'flex',
      justifyContent: 'center'
    },
    inputWrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '320px'
    },
    input: {
      backgroundColor: '#000000',
      border: '1px solid #4b5563',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '18px',
      width: '100%',
      cursor: 'pointer',
      outline: 'none'
    },
    inputFocused: {
      borderColor: '#ffffff'
    },
    calendarIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none',
      width: '24px',
      height: '24px'
    },
    calendar: {
      position: 'absolute',
      left: 0,
      top: '64px',
      width: '100%',
      backgroundColor: '#000000',
      border: '1px solid #374151',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: 20,
      padding: '16px',
      animation: 'fadeIn 0.2s ease-in'
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      position: 'relative'
    },
    navButton: {
      color: '#9ca3af',
      padding: '4px 8px',
      borderRadius: '9999px',
      outline: 'none',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent'
    },
    navButtonHover: {
      color: '#ffffff'
    },
    monthYearContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    monthYearButton: {
      fontWeight: '600',
      color: '#ffffff',
      cursor: 'pointer',
      position: 'relative',
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'underline'
    },
    dropdown: {
      position: 'absolute',
      left: 0,
      top: '32px',
      backgroundColor: '#000000',
      border: '1px solid #374151',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: 30,
      width: '128px',
      maxHeight: '240px',
      overflowY: 'auto'
    },
    dropdownItem: {
      padding: '8px 16px',
      cursor: 'pointer',
      color: '#e5e7eb'
    },
    dropdownItemSelected: {
      backgroundColor: '#374151',
      color: '#ffffff'
    },
    dropdownItemHover: {
      backgroundColor: '#374151'
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      textAlign: 'center',
      fontSize: '12px',
      color: '#9ca3af',
      marginBottom: '4px'
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px'
    },
    dayButton: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.1s ease',
      fontSize: '14px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    },
    dayButtonSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      fontWeight: 'bold'
    },
    dayButtonToday: {
      border: '1px solid #ffffff',
      color: '#ffffff'
    },
    dayButtonNormal: {
      color: '#e5e7eb'
    },
    dayButtonHover: {
      backgroundColor: '#374151'
    },
    dayButtonDisabled: {
      color: '#374151',
      cursor: 'not-allowed'
    },
    helpText: {
      color: '#9ca3af',
      fontSize: '14px',
      marginTop: '8px'
    }
  };

  // Close calendar if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowCalendar(false);
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // Get today's date for max
  const today = new Date();

  // Helper: format date as yyyy-mm-dd
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Helper: get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper: get first day of week (0=Sun, 1=Mon...)
  const getFirstDayOfWeek = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Calendar navigation
  const handlePrevMonth = () => {
    setCalendarMonth(prev => {
      const y = prev.getFullYear();
      const m = prev.getMonth();
      return new Date(y, m - 1, 1);
    });
  };
  const handleNextMonth = () => {
    setCalendarMonth(prev => {
      const y = prev.getFullYear();
      const m = prev.getMonth();
      return new Date(y, m + 1, 1);
    });
  };

  // Date selection
  const handleDateSelect = (year, month, day) => {
    const selected = new Date(year, month, day);
    if (selected > today) return; // Don't allow future dates
    onAnswer('personalInfo', 'dateOfBirth', formatDate(selected));
    setShowCalendar(false);
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  // Month and year dropdown logic
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = calendarMonth.getFullYear();
  const currentMonth = calendarMonth.getMonth();
  const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() - i); // Last 100 years

  const handleMonthSelect = (idx) => {
    setCalendarMonth(new Date(currentYear, idx, 1));
    setShowMonthDropdown(false);
    setTimeout(() => {
      setShowMonthDropdown(false);
    }, 0);
  };
  const handleYearSelect = (y) => {
    setCalendarMonth(new Date(y, currentMonth, 1));
    setShowYearDropdown(false);
    setTimeout(() => {
      setShowYearDropdown(false);
    }, 0);
  };

  const renderCalendar = () => {
    const year = currentYear;
    const month = currentMonth;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);
    const selectedDate = quizData.personalInfo.dateOfBirth ? new Date(quizData.personalInfo.dateOfBirth) : null;
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);

    return (
      <div style={dateStyles.calendar}>
        <div style={dateStyles.calendarHeader}>
          <button 
            onClick={handlePrevMonth} 
            style={dateStyles.navButton}
            onMouseEnter={(e) => Object.assign(e.target.style, dateStyles.navButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, dateStyles.navButton)}
          >←</button>
          <div style={dateStyles.monthYearContainer}>
            <button
              style={dateStyles.monthYearButton}
              onClick={() => { setShowMonthDropdown(v => !v); setShowYearDropdown(false); }}
            >
              {months[month]}
              {showMonthDropdown && (
                <div style={{...dateStyles.dropdown, width: '128px'}}>
                  {months.map((m, idx) => (
                    <div
                      key={m}
                      style={{
                        ...dateStyles.dropdownItem,
                        ...(idx === month ? dateStyles.dropdownItemSelected : {})
                      }}
                      onMouseEnter={(e) => {
                        if (idx !== month) Object.assign(e.target.style, dateStyles.dropdownItemHover);
                      }}
                      onMouseLeave={(e) => {
                        if (idx !== month) Object.assign(e.target.style, dateStyles.dropdownItem);
                      }}
                      onClick={() => handleMonthSelect(idx)}
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </button>
            <button
              style={dateStyles.monthYearButton}
              onClick={() => { setShowYearDropdown(v => !v); setShowMonthDropdown(false); }}
            >
              {year}
              {showYearDropdown && (
                <div style={{...dateStyles.dropdown, width: '112px'}}>
                  {years.map((y) => (
                    <div
                      key={y}
                      style={{
                        ...dateStyles.dropdownItem,
                        ...(y === year ? dateStyles.dropdownItemSelected : {})
                      }}
                      onMouseEnter={(e) => {
                        if (y !== year) Object.assign(e.target.style, dateStyles.dropdownItemHover);
                      }}
                      onMouseLeave={(e) => {
                        if (y !== year) Object.assign(e.target.style, dateStyles.dropdownItem);
                      }}
                      onClick={() => handleYearSelect(y)}
                    >
                      {y}
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>
          <button 
            onClick={handleNextMonth} 
            style={dateStyles.navButton}
            onMouseEnter={(e) => Object.assign(e.target.style, dateStyles.navButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, dateStyles.navButton)}
          >→</button>
        </div>
        <div style={dateStyles.weekDays}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div style={dateStyles.daysGrid}>
          {days.map((d, i) => {
            if (d === null) return <div key={i} />;
            const isSelected = selectedDate && d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isFuture = new Date(year, month, d) > today;
            
            let buttonStyle = {...dateStyles.dayButton};
            if (isFuture) {
              buttonStyle = {...buttonStyle, ...dateStyles.dayButtonDisabled};
            } else if (isSelected) {
              buttonStyle = {...buttonStyle, ...dateStyles.dayButtonSelected};
            } else if (isToday) {
              buttonStyle = {...buttonStyle, ...dateStyles.dayButtonToday};
            } else {
              buttonStyle = {...buttonStyle, ...dateStyles.dayButtonNormal};
            }
            
            return (
              <button
                key={i}
                disabled={isFuture}
                onClick={() => handleDateSelect(year, month, d)}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (!isFuture && !isSelected) {
                    Object.assign(e.target.style, dateStyles.dayButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFuture && !isSelected) {
                    if (isToday) {
                      Object.assign(e.target.style, dateStyles.dayButtonToday);
                    } else {
                      Object.assign(e.target.style, dateStyles.dayButtonNormal);
                    }
                  }
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={dateStyles.container}>
      <h1 style={dateStyles.title}>
        What is your date of birth?
      </h1>
      <div style={dateStyles.inputContainer}>
        <div
          ref={inputRef}
          style={dateStyles.inputWrapper}
        >
          <input
            type="text"
            readOnly
            value={quizData.personalInfo.dateOfBirth || ''}
            placeholder="Select your date of birth"
            style={dateStyles.input}
            onClick={() => setShowCalendar(v => !v)}
          />
          <span style={dateStyles.calendarIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '100%', height: '100%'}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a1.5 1.5 0 001.5-1.5V7.5a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 7.5v12A1.5 1.5 0 004.5 21z" />
            </svg>
          </span>
          {showCalendar && renderCalendar()}
        </div>
      </div>
      <p style={dateStyles.helpText}>Tap anywhere in the box to open the calendar.</p>
    </div>
  );
}

function GenderPage({ quizData, onAnswer }) {
  const options = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const genderStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '32px'
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      maxWidth: '448px',
      margin: '0 auto'
    },
    option: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    optionUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    optionHover: {
      borderColor: '#9ca3af'
    }
  };

  return (
    <div style={genderStyles.container}>
      <h1 style={genderStyles.title}>
        What is your gender?
      </h1>
      <div style={genderStyles.optionsGrid}>
        {options.map((option) => {
          const isSelected = quizData.personalInfo?.gender === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer('personalInfo', 'gender', option.value)}
              style={{
                ...genderStyles.option,
                ...(isSelected ? genderStyles.optionSelected : genderStyles.optionUnselected)
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, genderStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, genderStyles.optionUnselected);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OccupationPage({ quizData, onAnswer }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const occupationOptions = [
    'Student',
    'Working Professional',
    'Homemaker',
    'Retired',
    'Self-Employed',
    'Unemployed',
    'Other'
  ];

  const occupationStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '32px'
    },
    inputContainer: {
      display: 'flex',
      justifyContent: 'center'
    },
    inputWrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '448px'
    },
    input: {
      backgroundColor: '#000000',
      border: '1px solid #4b5563',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '18px',
      width: '100%',
      cursor: 'pointer',
      outline: 'none'
    },
    dropdownIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none',
      width: '24px',
      height: '24px'
    },
    dropdown: {
      position: 'absolute',
      left: 0,
      top: '64px',
      width: '100%',
      backgroundColor: '#000000',
      border: '1px solid #374151',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: 20,
      maxHeight: '240px',
      overflowY: 'auto',
      animation: 'fadeIn 0.2s ease-in'
    },
    dropdownItem: {
      padding: '8px 16px',
      cursor: 'pointer',
      color: '#e5e7eb'
    },
    dropdownItemSelected: {
      backgroundColor: '#374151',
      color: '#ffffff'
    },
    dropdownItemHover: {
      backgroundColor: '#374151'
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div style={occupationStyles.container}>
      <h1 style={occupationStyles.title}>
        What is your occupation?
      </h1>
      <div style={occupationStyles.inputContainer}>
        <div ref={inputRef} style={occupationStyles.inputWrapper}>
          <input
            type="text"
            value={quizData.personalInfo.occupation || ''}
            onChange={e => onAnswer('personalInfo', 'occupation', e.target.value)}
            placeholder="Select or enter your occupation"
            style={occupationStyles.input}
            onClick={() => setShowDropdown(v => !v)}
            autoComplete="off"
          />
          <span style={occupationStyles.dropdownIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '100%', height: '100%'}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
          {showDropdown && (
            <div style={occupationStyles.dropdown}>
              {occupationOptions.map(option => {
                const isSelected = quizData.personalInfo.occupation === option;
                return (
                  <div
                    key={option}
                    style={{
                      ...occupationStyles.dropdownItem,
                      ...(isSelected ? occupationStyles.dropdownItemSelected : {})
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) Object.assign(e.target.style, occupationStyles.dropdownItemHover);
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) Object.assign(e.target.style, occupationStyles.dropdownItem);
                    }}
                    onClick={() => {
                      onAnswer('personalInfo', 'occupation', option);
                      setShowDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkinTypePage({ quizData, onAnswer }) {
  const options = [
    { value: 'dry', label: 'dry' },
    { value: 'normal', label: 'normal' },
    { value: 'oily', label: 'oily' }
  ];

  const skinTypeStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '16px'
    },
    subtitle: {
      color: '#9ca3af',
      fontSize: '14px',
      marginBottom: '48px'
    },
    optionsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '32px',
      flexWrap: 'wrap'
    },
    option: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid transparent',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid #ffffff'
    },
    optionHover: {
      border: '1px solid #9ca3af'
    },
    circle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%'
    },
    circleSelected: {
      backgroundColor: '#ffffff'
    },
    circleUnselected: {
      backgroundColor: '#4b5563'
    },
    label: {
      fontSize: '18px',
      color: '#ffffff'
    }
  };

  return (
    <div style={skinTypeStyles.container}>
      <h1 style={skinTypeStyles.title}>
        what is your natural skin type?
      </h1>
      <p style={skinTypeStyles.subtitle}>
        your hair when untreated or unstyled
      </p>
      
      <div style={skinTypeStyles.optionsContainer}>
        {options.map((option) => {
          const isSelected = quizData.skinInfo.skinType === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer('skinInfo', 'skinType', option.value)}
              style={{
                ...skinTypeStyles.option,
                ...(isSelected ? skinTypeStyles.optionSelected : {})
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, skinTypeStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, {...skinTypeStyles.option, border: '1px solid transparent'});
                }
              }}
            >
              <div style={{
                ...skinTypeStyles.circle,
                ...(isSelected ? skinTypeStyles.circleSelected : skinTypeStyles.circleUnselected)
              }} />
              <span style={skinTypeStyles.label}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkinSensitivityPage({ quizData, onAnswer }) {
  const options = [
    { value: 'extremely-sensitive', label: 'extremely sensitive' },
    { value: 'highly-sensitive', label: 'highly sensitive' },
    { value: 'moderately-sensitive', label: 'moderately sensitive' },
    { value: 'mildly-sensitive', label: 'mildly sensitive' },
    { value: 'not-sensitive', label: 'not sensitive' }
  ];

  const sensitivityStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '16px'
    },
    subtitle: {
      color: '#9ca3af',
      fontSize: '14px',
      marginBottom: '48px'
    },
    optionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '16px'
    },
    option: {
      padding: '12px 24px',
      borderRadius: '9999px',
      border: '1px solid',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    optionUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    optionHover: {
      borderColor: '#9ca3af'
    }
  };

  return (
    <div style={sensitivityStyles.container}>
      <h1 style={sensitivityStyles.title}>
        Is your skin sensitive?
      </h1>
      <p style={sensitivityStyles.subtitle}>
        how does your skin feel without face wash
      </p>
      <div style={sensitivityStyles.optionsContainer}>
        {options.map((option) => {
          const isSelected = quizData.skinInfo.skinSensitivity === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer('skinInfo', 'skinSensitivity', option.value)}
              style={{
                ...sensitivityStyles.option,
                ...(isSelected ? sensitivityStyles.optionSelected : sensitivityStyles.optionUnselected)
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, sensitivityStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, sensitivityStyles.optionUnselected);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkinConcernsPage({ quizData, onAnswer }) {
  const options = [
    { value: 'acne', label: 'Acne' },
    { value: 'pimples', label: 'Pimples' },
    { value: 'blackheads', label: 'Blackheads' },
    { value: 'dark-spots', label: 'Dark Spots' },
    { value: 'wrinkles', label: 'Wrinkles' },
    { value: 'dryness', label: 'Dryness' },
    { value: 'oiliness', label: 'Oiliness' },
    { value: 'redness', label: 'Redness' },
    { value: 'no-concerns', label: 'No Concerns' }
  ];

  const currentConcerns = quizData.skinInfo.skinConcerns || [];

  const concernsStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '32px'
    },
    subtitle: {
      color: '#9ca3af',
      fontSize: '14px',
      marginBottom: '32px'
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      maxWidth: '672px',
      margin: '0 auto'
    },
    option: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    optionUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    optionDisabled: {
      borderColor: '#374151',
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    optionHover: {
      borderColor: '#9ca3af'
    }
  };

  const handleToggle = (value) => {
    let newConcerns;
    if (currentConcerns.includes(value)) {
      newConcerns = currentConcerns.filter(concern => concern !== value);
    } else {
      if (value === 'no-concerns') {
        newConcerns = ['no-concerns'];
      } else {
        newConcerns = currentConcerns.filter(c => c !== 'no-concerns');
        newConcerns.push(value);
      }
    }
    onAnswer('skinInfo', 'skinConcerns', newConcerns);
  };

  return (
    <div style={concernsStyles.container}>
      <h1 style={concernsStyles.title}>
        What are your main skin concerns?
      </h1>
      <p style={concernsStyles.subtitle}>
        Select all that apply
      </p>
      <div style={concernsStyles.optionsGrid}>
        {options.map((option) => {
          const isSelected = currentConcerns.includes(option.value);
          const isNoConcerns = currentConcerns.includes('no-concerns');
          const canSelect = option.value === 'no-concerns' || !isNoConcerns;
          
          let buttonStyle = {...concernsStyles.option};
          if (isSelected) {
            buttonStyle = {...buttonStyle, ...concernsStyles.optionSelected};
          } else if (canSelect) {
            buttonStyle = {...buttonStyle, ...concernsStyles.optionUnselected};
          } else {
            buttonStyle = {...buttonStyle, ...concernsStyles.optionDisabled};
          }
          
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              disabled={!canSelect && !isSelected}
              style={buttonStyle}
              onMouseEnter={(e) => {
                if (canSelect && !isSelected) {
                  Object.assign(e.target.style, concernsStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (canSelect && !isSelected) {
                  Object.assign(e.target.style, concernsStyles.optionUnselected);
                }
              }}
            >
              {option.label}
              {isSelected && <span style={{marginLeft: '8px'}}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LifestylePage({ quizData, onAnswer }) {
  const stressOptions = [
    { value: 'very-low', label: 'Very Low' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'very-high', label: 'Very High' }
  ];

  const sleepOptions = [
    { value: 'less-than-5', label: 'Less than 5 hours' },
    { value: '5-6', label: '5-6 hours' },
    { value: '7-8', label: '7-8 hours' },
    { value: '8-9', label: '8-9 hours' },
    { value: 'more-than-9', label: 'More than 9 hours' }
  ];

  const waterOptions = [
    { value: 'less-than-2', label: 'Less than 2 glasses' },
    { value: '2-4', label: '2-4 glasses' },
    { value: '6-8', label: '6-8 glasses' },
    { value: 'more-than-8', label: 'More than 8 glasses' }
  ];

  const exerciseOptions = [
    { value: 'never', label: 'Never' },
    { value: 'once-a-week', label: 'Once a week' },
    { value: '2-3-times', label: '2-3 times a week' },
    { value: '4-5-times', label: '4-5 times a week' },
    { value: 'daily', label: 'Daily' }
  ];

  const lifestyleStyles = {
    container: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    sectionTitle: {
      fontSize: '20px',
      marginBottom: '16px',
      color: '#ffffff'
    },
    optionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '8px'
    },
    option: {
      padding: '8px 16px',
      borderRadius: '9999px',
      border: '1px solid',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    optionUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    optionHover: {
      borderColor: '#9ca3af'
    }
  };

  const renderSection = (title, options, currentValue, field) => (
    <div style={lifestyleStyles.section}>
      <h3 style={lifestyleStyles.sectionTitle}>{title}</h3>
      <div style={lifestyleStyles.optionsContainer}>
        {options.map((option) => {
          const isSelected = currentValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer('lifestyleInfo', field, option.value)}
              style={{
                ...lifestyleStyles.option,
                ...(isSelected ? lifestyleStyles.optionSelected : lifestyleStyles.optionUnselected)
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, lifestyleStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, lifestyleStyles.optionUnselected);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={lifestyleStyles.container}>
      <h1 style={lifestyleStyles.title}>
        Tell us about your lifestyle
      </h1>
      
      {renderSection(
        "How would you rate your stress level?",
        stressOptions,
        quizData.lifestyleInfo?.stressLevel,
        'stressLevel'
      )}

      {renderSection(
        "How many hours do you sleep?",
        sleepOptions,
        quizData.lifestyleInfo?.sleepHours,
        'sleepHours'
      )}

      {renderSection(
        "How much water do you drink daily?",
        waterOptions,
        quizData.lifestyleInfo?.waterIntake,
        'waterIntake'
      )}

      {renderSection(
        "How often do you exercise?",
        exerciseOptions,
        quizData.lifestyleInfo?.exerciseFrequency,
        'exerciseFrequency'
      )}
    </div>
  );
}

function DietPage({ quizData, onAnswer }) {
  const junkFoodOptions = [
    { value: 'never', label: 'Never' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'sometimes', label: 'Sometimes' },
    { value: 'often', label: 'Often' },
    { value: 'daily', label: 'Daily' }
  ];

  const sugarOptions = [
    { value: 'very-low', label: 'Very Low' },
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'very-high', label: 'Very High' }
  ];

  const dietTypeOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'non-vegetarian', label: 'Non-Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'mixed', label: 'Mixed/Flexible' }
  ];

  const dietStyles = {
    container: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    sectionTitle: {
      fontSize: '20px',
      marginBottom: '16px',
      color: '#ffffff'
    },
    optionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '8px'
    },
    option: {
      padding: '8px 16px',
      borderRadius: '9999px',
      border: '1px solid',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    optionUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    optionHover: {
      borderColor: '#9ca3af'
    }
  };

  const renderSection = (title, options, currentValue, field) => (
    <div style={dietStyles.section}>
      <h3 style={dietStyles.sectionTitle}>{title}</h3>
      <div style={dietStyles.optionsContainer}>
        {options.map((option) => {
          const isSelected = currentValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer('dietInfo', field, option.value)}
              style={{
                ...dietStyles.option,
                ...(isSelected ? dietStyles.optionSelected : dietStyles.optionUnselected)
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, dietStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, dietStyles.optionUnselected);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={dietStyles.container}>
      <h1 style={dietStyles.title}>
        About your eating habits
      </h1>

      {renderSection(
        "What type of diet do you follow?",
        dietTypeOptions,
        quizData.dietInfo?.dietType,
        'dietType'
      )}

      {renderSection(
        "How often do you eat junk food?",
        junkFoodOptions,
        quizData.dietInfo?.junkFoodFrequency,
        'junkFoodFrequency'
      )}

      {renderSection(
        "How would you rate your sugar intake?",
        sugarOptions,
        quizData.dietInfo?.sugarIntake,
        'sugarIntake'
      )}
    </div>
  );
}

function MenstrualPage({ quizData, onAnswer }) {
  const menstrualStyles = {
    container: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    sectionTitle: {
      fontSize: '20px',
      marginBottom: '16px',
      color: '#ffffff'
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px'
    },
    button: {
      padding: '16px 32px',
      borderRadius: '9999px',
      border: '1px solid',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    buttonSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    buttonUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    buttonHover: {
      borderColor: '#9ca3af'
    }
  };

  return (
    <div style={menstrualStyles.container}>
      <h1 style={menstrualStyles.title}>
        Menstrual Health
      </h1>
      
      <div style={menstrualStyles.section}>
        <h3 style={menstrualStyles.sectionTitle}>Do you have a regular menstrual cycle?</h3>
        <div style={menstrualStyles.buttonsContainer}>
          <button
            onClick={() => onAnswer('menstrualInfo', 'hasRegularCycle', true)}
            style={{
              ...menstrualStyles.button,
              ...(quizData.menstrualInfo.hasRegularCycle === true ? menstrualStyles.buttonSelected : menstrualStyles.buttonUnselected)
            }}
            onMouseEnter={(e) => {
              if (quizData.menstrualInfo.hasRegularCycle !== true) {
                Object.assign(e.target.style, menstrualStyles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (quizData.menstrualInfo.hasRegularCycle !== true) {
                Object.assign(e.target.style, menstrualStyles.buttonUnselected);
              }
            }}
          >
            Yes
          </button>
          <button
            onClick={() => onAnswer('menstrualInfo', 'hasRegularCycle', false)}
            style={{
              ...menstrualStyles.button,
              ...(quizData.menstrualInfo.hasRegularCycle === false ? menstrualStyles.buttonSelected : menstrualStyles.buttonUnselected)
            }}
            onMouseEnter={(e) => {
              if (quizData.menstrualInfo.hasRegularCycle !== false) {
                Object.assign(e.target.style, menstrualStyles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (quizData.menstrualInfo.hasRegularCycle !== false) {
                Object.assign(e.target.style, menstrualStyles.buttonUnselected);
              }
            }}
          >
            No
          </button>
        </div>
      </div>

      <div style={menstrualStyles.section}>
        <h3 style={menstrualStyles.sectionTitle}>Do you notice skin changes with your cycle?</h3>
        <div style={menstrualStyles.buttonsContainer}>
          <button
            onClick={() => onAnswer('menstrualInfo', 'skinChangesWithCycle', true)}
            style={{
              ...menstrualStyles.button,
              ...(quizData.menstrualInfo.skinChangesWithCycle === true ? menstrualStyles.buttonSelected : menstrualStyles.buttonUnselected)
            }}
            onMouseEnter={(e) => {
              if (quizData.menstrualInfo.skinChangesWithCycle !== true) {
                Object.assign(e.target.style, menstrualStyles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (quizData.menstrualInfo.skinChangesWithCycle !== true) {
                Object.assign(e.target.style, menstrualStyles.buttonUnselected);
              }
            }}
          >
            Yes
          </button>
          <button
            onClick={() => onAnswer('menstrualInfo', 'skinChangesWithCycle', false)}
            style={{
              ...menstrualStyles.button,
              ...(quizData.menstrualInfo.skinChangesWithCycle === false ? menstrualStyles.buttonSelected : menstrualStyles.buttonUnselected)
            }}
            onMouseEnter={(e) => {
              if (quizData.menstrualInfo.skinChangesWithCycle !== false) {
                Object.assign(e.target.style, menstrualStyles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (quizData.menstrualInfo.skinChangesWithCycle !== false) {
                Object.assign(e.target.style, menstrualStyles.buttonUnselected);
              }
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalsPage({ quizData, onAnswer }) {
  const goalOptions = [
    { value: 'clear-acne', label: 'Clear Acne' },
    { value: 'reduce-pimples', label: 'Reduce Pimples' },
    { value: 'anti-aging', label: 'Anti-Aging' },
    { value: 'hydration', label: 'Better Hydration' },
    { value: 'oil-control', label: 'Oil Control' },
    { value: 'brightening', label: 'Skin Brightening' },
    { value: 'track-skin-changes', label: 'Tracking my skin changes' }
  ];

  const currentGoals = quizData.goals.primaryGoals || [];

  const goalsStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '16px'
    },
    subtitle: {
      color: '#9ca3af',
      fontSize: '14px',
      marginBottom: '32px'
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      maxWidth: '672px',
      margin: '0 auto'
    },
    option: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    optionUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    optionDisabled: {
      borderColor: '#374151',
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    optionHover: {
      borderColor: '#9ca3af'
    }
  };

  const handleToggle = (value) => {
    let newGoals;
    if (currentGoals.includes(value)) {
      newGoals = currentGoals.filter(goal => goal !== value);
    } else if (currentGoals.length < 3) {
      newGoals = [...currentGoals, value];
    } else {
      return; // Don't allow more than 3 selections
    }
    onAnswer('goals', 'primaryGoals', newGoals);
  };

  return (
    <div style={goalsStyles.container}>
      <h1 style={goalsStyles.title}>
        What are your skincare goals?
      </h1>
      <p style={goalsStyles.subtitle}>
        Select up to 3 goals
      </p>
      
      <div style={goalsStyles.optionsGrid}>
        {goalOptions.map((option) => {
          const isSelected = currentGoals.includes(option.value);
          const canSelect = currentGoals.length < 3 || isSelected;
          
          let buttonStyle = {...goalsStyles.option};
          if (isSelected) {
            buttonStyle = {...buttonStyle, ...goalsStyles.optionSelected};
          } else if (canSelect) {
            buttonStyle = {...buttonStyle, ...goalsStyles.optionUnselected};
          } else {
            buttonStyle = {...buttonStyle, ...goalsStyles.optionDisabled};
          }
          
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              disabled={!canSelect}
              style={buttonStyle}
              onMouseEnter={(e) => {
                if (canSelect && !isSelected) {
                  Object.assign(e.target.style, goalsStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (canSelect && !isSelected) {
                  Object.assign(e.target.style, goalsStyles.optionUnselected);
                }
              }}
            >
              {option.label}
              {isSelected && <span style={{marginLeft: '8px'}}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Welcome Page Component
function WelcomePage({ onStart }) {
  const welcomeStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: '32px',
      animation: 'fadeIn 0.5s ease-in'
    },
    title: {
      fontSize: '48px',
      fontWeight: '800',
      background: 'linear-gradient(to right, #86efac, #3b82f6, #a855f7)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      marginBottom: '16px'
    },
    description: {
      fontSize: '20px',
      color: '#e5e7eb',
      maxWidth: '672px',
      margin: '0 auto'
    },
    startButton: {
      marginTop: '32px',
      padding: '16px 32px',
      borderRadius: '9999px',
      background: 'linear-gradient(to right, #4ade80, #3b82f6)',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '20px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    },
    helpContainer: {
      marginTop: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    helpText: {
      fontSize: '14px',
      color: '#9ca3af'
    },
    subHelpText: {
      fontSize: '12px',
      color: '#6b7280'
    }
  };

  return (
    <div style={welcomeStyles.container}>
      <h1 style={welcomeStyles.title}>Welcome to OliveClear!</h1>
      <p style={welcomeStyles.description}>We're excited to help you on your skincare journey. This quick quiz will personalize your experience and recommendations. Ready to get started?</p>
      <button
        onClick={onStart}
        style={welcomeStyles.startButton}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        Start Quiz
      </button>
      <div style={welcomeStyles.helpContainer}>
        <span style={welcomeStyles.helpText}>Need help?</span>
        <span style={welcomeStyles.subHelpText}>You can always revisit this quiz in your profile settings.</span>
      </div>
    </div>
  );
}

// Tutorial Page Component
function TutorialPage({ onFinish }) {
  const tutorialStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: '32px',
      animation: 'fadeIn 0.5s ease-in'
    },
    title: {
      fontSize: '48px',
      fontWeight: '800',
      background: 'linear-gradient(to right, #fbbf24, #ec4899, #a855f7)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      marginBottom: '16px'
    },
    description: {
      fontSize: '20px',
      color: '#e5e7eb',
      maxWidth: '672px',
      margin: '0 auto'
    },
    featuresList: {
      textAlign: 'left',
      color: '#d1d5db',
      maxWidth: '576px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    featureItem: {
      fontSize: '16px'
    },
    finishButton: {
      marginTop: '32px',
      padding: '16px 32px',
      borderRadius: '9999px',
      background: 'linear-gradient(to right, #fbbf24, #ec4899)',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '20px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    }
  };

  return (
    <div style={tutorialStyles.container}>
      <h1 style={tutorialStyles.title}>You're All Set!</h1>
      <p style={tutorialStyles.description}>Here's a quick tour of your dashboard and how to get the most out of OliveClear. Explore your personalized recommendations, track your progress, and access expert tips anytime.</p>
      <ul style={tutorialStyles.featuresList}>
        <li style={tutorialStyles.featureItem}>• <b>Dashboard:</b> See your skin health summary and progress.</li>
        <li style={tutorialStyles.featureItem}>• <b>Recommendations:</b> Get routines and products tailored for you.</li>
        <li style={tutorialStyles.featureItem}>• <b>Track Progress:</b> Log your skin changes and improvements.</li>
        <li style={tutorialStyles.featureItem}>• <b>Expert Tips:</b> Access advice and articles from dermatologists.</li>
      </ul>
      <button
        onClick={onFinish}
        style={tutorialStyles.finishButton}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}

function TimelinePage({ quizData, onAnswer }) {
  const timelineOptions = [
    { value: '1-2-weeks', label: '1-2 weeks' },
    { value: '1-month', label: '1 month' },
    { value: '3-months', label: '3 months' },
    { value: '6-months', label: '6 months' },
    { value: '1-year', label: '1 year or more' }
  ];

  const timelineStyles = {
    container: {
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '32px'
    },
    optionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '16px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    option: {
      padding: '12px 24px',
      borderRadius: '9999px',
      border: '1px solid',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionSelected: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#ffffff'
    },
    optionUnselected: {
      borderColor: '#4b5563',
      color: '#d1d5db'
    },
    optionHover: {
      borderColor: '#9ca3af'
    }
  };

  return (
    <div style={timelineStyles.container}>
      <h1 style={timelineStyles.title}>
        When do you expect to see results?
      </h1>
      <div style={timelineStyles.optionsContainer}>
        {timelineOptions.map((option) => {
          const isSelected = quizData.goals?.timeExpectation === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer('goals', 'timeExpectation', option.value)}
              style={{
                ...timelineStyles.option,
                ...(isSelected ? timelineStyles.optionSelected : timelineStyles.optionUnselected)
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, timelineStyles.optionHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  Object.assign(e.target.style, timelineStyles.optionUnselected);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewPage({ quizData }) {
  const reviewStyles = {
    container: {
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '32px'
    },
    subtitle: {
      color: '#9ca3af',
      fontSize: '16px',
      marginBottom: '32px'
    },
    section: {
      marginBottom: '24px',
      textAlign: 'left'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '12px'
    },
    sectionContent: {
      color: '#d1d5db',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    divider: {
      height: '1px',
      backgroundColor: '#374151',
      margin: '24px 0'
    }
  };

  const formatArrayValue = (arr) => {
    if (!arr || !Array.isArray(arr)) return 'Not specified';
    return arr.join(', ');
  };

  return (
    <div style={reviewStyles.container}>
      <h1 style={reviewStyles.title}>
        Review Your Answers
      </h1>
      <p style={reviewStyles.subtitle}>
        Please review your information before submitting
      </p>

      <div style={reviewStyles.section}>
        <h3 style={reviewStyles.sectionTitle}>Personal Information</h3>
        <div style={reviewStyles.sectionContent}>
          <p><strong>Date of Birth:</strong> {quizData.personalInfo?.dateOfBirth || 'Not specified'}</p>
          <p><strong>Gender:</strong> {quizData.personalInfo?.gender || 'Not specified'}</p>
          <p><strong>Occupation:</strong> {quizData.personalInfo?.occupation || 'Not specified'}</p>
        </div>
      </div>

      <div style={reviewStyles.divider}></div>

      <div style={reviewStyles.section}>
        <h3 style={reviewStyles.sectionTitle}>Skin Information</h3>
        <div style={reviewStyles.sectionContent}>
          <p><strong>Skin Type:</strong> {quizData.skinInfo?.skinType || 'Not specified'}</p>
          <p><strong>Skin Sensitivity:</strong> {quizData.skinInfo?.skinSensitivity || 'Not specified'}</p>
          <p><strong>Skin Concerns:</strong> {formatArrayValue(quizData.skinInfo?.skinConcerns)}</p>
        </div>
      </div>

      <div style={reviewStyles.divider}></div>

      <div style={reviewStyles.section}>
        <h3 style={reviewStyles.sectionTitle}>Lifestyle & Diet</h3>
        <div style={reviewStyles.sectionContent}>
          <p><strong>Stress Level:</strong> {quizData.lifestyleInfo?.stressLevel || 'Not specified'}</p>
          <p><strong>Sleep Hours:</strong> {quizData.lifestyleInfo?.sleepHours || 'Not specified'}</p>
          <p><strong>Water Intake:</strong> {quizData.lifestyleInfo?.waterIntake || 'Not specified'}</p>
          <p><strong>Exercise Frequency:</strong> {quizData.lifestyleInfo?.exerciseFrequency || 'Not specified'}</p>
          <p><strong>Diet Type:</strong> {quizData.dietInfo?.dietType || 'Not specified'}</p>
          <p><strong>Junk Food Frequency:</strong> {quizData.dietInfo?.junkFoodFrequency || 'Not specified'}</p>
          <p><strong>Sugar Intake:</strong> {quizData.dietInfo?.sugarIntake || 'Not specified'}</p>
        </div>
      </div>

      {quizData.menstrualInfo && (
        <>
          <div style={reviewStyles.divider}></div>
          <div style={reviewStyles.section}>
            <h3 style={reviewStyles.sectionTitle}>Menstrual Health</h3>
            <div style={reviewStyles.sectionContent}>
              <p><strong>Regular Cycle:</strong> {quizData.menstrualInfo.hasRegularCycle !== undefined ? (quizData.menstrualInfo.hasRegularCycle ? 'Yes' : 'No') : 'Not specified'}</p>
              <p><strong>Skin Changes with Cycle:</strong> {quizData.menstrualInfo.skinChangesWithCycle !== undefined ? (quizData.menstrualInfo.skinChangesWithCycle ? 'Yes' : 'No') : 'Not specified'}</p>
            </div>
          </div>
        </>
      )}

      <div style={reviewStyles.divider}></div>

      <div style={reviewStyles.section}>
        <h3 style={reviewStyles.sectionTitle}>Goals</h3>
        <div style={reviewStyles.sectionContent}>
          <p><strong>Primary Goals:</strong> {formatArrayValue(quizData.goals?.primaryGoals)}</p>
          <p><strong>Expected Timeline:</strong> {quizData.goals?.timeExpectation || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}
