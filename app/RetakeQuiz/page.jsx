"use client";
import { useState, useEffect } from "react";

// Inline styles object for all UI elements (converted from Tailwind)
// Use a function to generate styles with isMobile
const getStyles = (isMobile) => ({
  // Layout
  page: {
    height: '87vh',
    overflowY: 'hidden',
    background: '#171717',
    color: '#ebebeb',
    marginLeft: isMobile ? '0' : '150px',
    marginTop: isMobile ? '70px' : '100px',
  },
  container: {
    maxWidth: 672, // 2xl
    margin: '0 auto',
    marginBottom: isMobile ? 16 : 0,
    padding: 24,
    paddingTop: isMobile ? 16 : 8,
  },
  textCenter: { textAlign: 'center' },
  mb8: { marginBottom: 32 },
  mb4: { marginBottom: 16 },
  mb12: { marginBottom: 48 },
  mt8: { marginTop: 32 },
  mt6: { marginTop: 24 },
  spaceY4: { marginBottom: 16 },
  spaceY6: { marginBottom: 24 },
  spaceY12: { marginBottom: 48 },
  flex: { display: 'flex' },
  flexCol: { display: 'flex', flexDirection: 'column' },
  flexWrap: { flexWrap: 'wrap' },
  flex1: { flex: 1 },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  itemsCenter: { alignItems: 'center' },
  gap4: { gap: 16 },
  gap2: { gap: 8 },
  grid: { display: 'grid' },
  gridCols2: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  gridCols3: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  mdGridCols2: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  maxW2xl: { maxWidth: 672, margin: '0 auto' },
  // Progress bar
  progressBar: { width: '100%', background: '#1f2937', height: 4 },
  progressFill: (width) => ({ background: '#fff', height: 4, transition: 'width 0.3s', width }),
  // Card/Section
  card: {
    padding: 16,
    background: '#111827',
    borderRadius: 12,
    border: '1px solid #4b5563',
    marginBottom: 16,
  },
  cardNotRetakable: {
    padding: 16,
    background: '#1f2937',
    borderRadius: 12,
    border: '1px solid #4b5563',
    marginBottom: 16,
  },
  cardHover: {
    background: '#1f2937',
    transition: 'background 0.2s',
  },
  cardSelected: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #fff',
  },
  // Button
  button: {
    padding: '8px 24px',
    borderRadius: 8,
    border: '1px solid #4b5563',
    color: '#fff',
    background: 'transparent',
    transition: 'background 0.2s, color 0.2s',
    cursor: 'pointer',
  },
  buttonCancel: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid #4b5563',
  },
  buttonContinue: (enabled) => ({
    padding: '8px 24px',
    borderRadius: 8,
    transition: 'background 0.2s, color 0.2s',
    background: enabled ? '#fff' : '#4b5563',
    color: enabled ? '#000' : '#9ca3af',
    border: 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
  }),
  buttonNext: (enabled) => ({
    padding: '8px 24px',
    borderRadius: 8,
    transition: 'background 0.2s, color 0.2s',
    background: enabled ? '#fff' : '#4b5563',
    color: enabled ? '#000' : '#9ca3af',
    border: 'none',
    cursor: enabled ? 'pointer' : 'not-allowed',
  }),
  buttonBack: {
    padding: '8px 24px',
    borderRadius: 8,
    border: '1px solid #4b5563',
    color: '#fff',
    background: 'transparent',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  // Checkbox
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
    accentColor: '#fff',
    border: '1px solid #4b5563',
    borderRadius: 4,
    background: '#1f2937',
  },
  // Input
  input: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    background: '#1f2937',
    border: '1px solid #374151',
    color: '#fff',
    outline: 'none',
    marginBottom: 8,
  },
  inputFocus: {
    outline: '2px solid #fff',
  },
  select: {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    background: '#1f2937',
    border: '1px solid #374151',
    color: '#fff',
    outline: 'none',
    marginBottom: 8,
  },
  // Misc
  roundedLg: { borderRadius: 12 },
  border: { border: '1px solid #4b5563' },
  borderWhite: { border: '1px solid #fff' },
  borderGreen: { border: '1px solid #10b98133' },
  borderRed: { border: '1px solid #ef4444' },
  bgGreen: { background: 'rgba(16,185,129,0.18)' },
  bgRed: { background: 'rgba(239,68,68,0.12)' },
  bgGray: { background: '#1f2937' },
  bgGray900: { background: '#111827' },
  textWhite: { color: '#fff' },
  textBlack: { color: '#000' },
  textGray: { color: '#9ca3af' },
  textGreen: { color: '#10b981' },
  textRed: { color: '#ef4444' },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  fontBold: { fontWeight: 700 },
  fontLight: { fontWeight: 300 },
  fontSemibold: { fontWeight: 600 },
  h1: { fontSize: 32, fontWeight: 700, marginBottom: 8 },
  h2: { fontSize: 24, fontWeight: 600, marginBottom: 8 },
  h3: { fontSize: 18, fontWeight: 600, marginBottom: 8 },
  // Spinner
  spinner: {
    display: 'block',
    margin: '0 auto 16px',
    borderRadius: '50%',
    height: 48,
    width: 48,
    borderBottom: '2px solid #fff',
    animation: 'spin 1s linear infinite',
  },
  // Error/Success
  errorBox: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid #ef4444',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 16,
  },
  successBox: {
    background: 'rgba(16,185,129,0.18)',
    border: '1px solid #10b98133',
    color: '#6ee7b7',
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 16,
  },
});

// Inject spinner keyframes if not already present
if (typeof window !== 'undefined' && !document.getElementById('retake-quiz-spinner-keyframes')) {
  const style = document.createElement('style');
  style.id = 'retake-quiz-spinner-keyframes';
  style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


export default function RetakeQuiz() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [quizData, setQuizData] = useState({
    skinInfo: {},
    lifestyleInfo: {},
    dietInfo: {},
    menstrualInfo: {},
    goals: {}
  });
  const [previousData, setPreviousData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Add initial loading state
  const [error, setError] = useState("");
  const [userGender, setUserGender] = useState("");
  const [retakeStatus, setRetakeStatus] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [isScreen, setIsScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const styles = getStyles(isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsScreen(window.innerWidth <= 768);
      setIsMobile(window.innerWidth <= 430);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = 10; // Adjusted for retake (excluding personal info pages)

  // Define handleSubmit first to avoid hoisting issues
  const handleSubmit = async () => {
    if (selectedSections.length === 0) {
      setError("Please select at least one section to retake");
      return;
    }
    
    // Basic validation - only check if at least one field is filled in each selected section
    // Don't require specific fields since this is a retake and user can choose what to update
    let hasValidData = false;
    
    for (const section of selectedSections) {
      const sectionData = quizData[section];
      if (sectionData && Object.keys(sectionData).length > 0) {
        // Check if section has at least some data
        const hasData = Object.values(sectionData).some(value => {
          if (Array.isArray(value)) return value.length > 0;
          return value !== '' && value !== null && value !== undefined;
        });
        if (hasData) {
          hasValidData = true;
          break;
        }
      }
    }
    
    if (!hasValidData) {
      setError("Please fill in at least some information in the selected sections");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Prepare submission data - only include selected sections
    const submissionData = {};
    selectedSections.forEach(section => {
      submissionData[section] = quizData[section];
    });
    
    // Debug: Log the submission data
    console.log('Retake submission data:', JSON.stringify(submissionData, null, 2));
    
    try {
      const token = Cookies.get("token");
      
      // Add retake flag to submission data
      const finalSubmissionData = {
        ...submissionData,
        isRetake: true,
        selectedSections: selectedSections
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/retake-submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(finalSubmissionData)
      });
      
      if (response.status === 401) {
        Cookies.remove("token");
        router.replace("/login");
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        // Update localStorage cache
        localStorage.setItem("quizCompleted", "true");
        
        // Show success message
        alert("Quiz retaken successfully! Your preferences have been updated.");
        
        // Redirect to home
        router.replace("/"); 
      } else {
        setError(data.error || data.message || "Failed to submit quiz retake");
      }
    } catch (error) {
      setError("Failed to submit quiz retake. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication and get retake status
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchRetakeStatus();
  }, [router]);

  const fetchRetakeStatus = async () => {
    try {
      setIsInitialLoading(true);
      const token = Cookies.get("token");
      
      // First check if user has completed initial quiz
      const quizStatusResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/status`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (quizStatusResponse.status === 401) {
        Cookies.remove("token");
        router.replace("/login");
        return;
      }

      if (!quizStatusResponse.ok) {
        setError("Failed to check quiz status");
        setIsInitialLoading(false);
        return;
      }

      const quizStatusData = await quizStatusResponse.json();
      
      // If initial quiz is not completed, redirect to initial quiz
      if (!quizStatusData.data?.quizCompleted) {
        console.log("Initial quiz not completed, redirecting to InitialQuiz");
        router.replace("/InitialQuiz");
        return;
      }

      // Now check retake status (optional endpoint)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/retake-status`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRetakeStatus(data.data);
        } else {
          // If retake-status endpoint doesn't exist, create a default status
          setRetakeStatus({ totalAttempts: 1 });
        }
      } catch (error) {
        // If retake-status endpoint doesn't exist, create a default status
        console.log("Retake status endpoint not available, using default");
        setRetakeStatus({ totalAttempts: 1 });
      }

      // Fetch the latest quiz data to pre-populate forms
      await fetchPreviousQuizData();
      
    } catch (error) {
      console.error("Error fetching retake status:", error);
      setError("Failed to load quiz data");
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchPreviousQuizData = async () => {
    try {
      const token = Cookies.get("token");
      
      // Try to get quiz data from the status endpoint first
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/status`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if quiz data is available in the response
        if (data.data?.quizData) {
          const originalData = data.data.quizData;
          setPreviousData(originalData);
          setUserGender(originalData.personalInfo?.gender || "");
          
          // Transform and populate quiz data properly
          const transformedData = {
            skinInfo: {
              skinType: originalData.skinInfo?.skinType || '',
              skinSensitivity: originalData.skinInfo?.skinSensitivity || '',
              skinConcerns: originalData.skinInfo?.skinConcerns || [],
              currentSkincarRoutine: originalData.skinInfo?.currentSkincarRoutine || '',
              allergies: originalData.skinInfo?.allergies || ''
            },
            lifestyleInfo: {
              stressLevel: originalData.lifestyleInfo?.stressLevel || '',
              sleepHours: originalData.lifestyleInfo?.sleepHours || '',
              waterIntake: originalData.lifestyleInfo?.waterIntake || '',
              exerciseFrequency: originalData.lifestyleInfo?.exerciseFrequency || '',
              sunExposure: originalData.lifestyleInfo?.sunExposure || '',
              smokingStatus: originalData.lifestyleInfo?.smokingStatus || ''
            },
            dietInfo: {
              dietType: originalData.dietInfo?.dietType || '',
              junkFoodFrequency: originalData.dietInfo?.junkFoodFrequency || '',
              dairyIntake: originalData.dietInfo?.dairyIntake || '',
              sugarIntake: originalData.dietInfo?.sugarIntake || '',
              fruitVeggieIntake: originalData.dietInfo?.fruitVeggieIntake || ''
            },
            menstrualInfo: {
              hasRegularCycle: originalData.menstrualInfo?.hasRegularCycle,
              skinChangesWithCycle: originalData.menstrualInfo?.skinChangesWithCycle,
              cycleRegularity: originalData.menstrualInfo?.cycleRegularity || '',
              cycleLength: originalData.menstrualInfo?.cycleLength || '',
              menstrualFlow: originalData.menstrualInfo?.menstrualFlow || '',
              pmsSymptoms: originalData.menstrualInfo?.pmsSymptoms || ''
            },
            goals: {}
          };

          // Transform goals data - handle both InitialQuiz and RetakeQuiz formats
          const originalGoals = originalData.goals || {};
          
          // Handle primaryGoals array from InitialQuiz
          if (originalGoals.primaryGoals && Array.isArray(originalGoals.primaryGoals)) {
            transformedData.goals.primaryGoal = originalGoals.primaryGoals.length > 0 
              ? originalGoals.primaryGoals.join(', ') // Join multiple goals
              : '';
          } else if (originalGoals.primaryGoal) {
            transformedData.goals.primaryGoal = originalGoals.primaryGoal;
          } else {
            transformedData.goals.primaryGoal = '';
          }

          // Map timeExpectation to both short and long term goals if they don't exist
          if (originalGoals.timeExpectation) {
            transformedData.goals.shortTermGoals = originalGoals.shortTermGoals || originalGoals.timeExpectation;
            transformedData.goals.longTermGoals = originalGoals.longTermGoals || originalGoals.timeExpectation;
          } else {
            transformedData.goals.shortTermGoals = originalGoals.shortTermGoals || '';
            transformedData.goals.longTermGoals = originalGoals.longTermGoals || '';
          }

          // Set other goal fields
          transformedData.goals.concerns = originalGoals.concerns || '';
          transformedData.goals.secondaryGoals = originalGoals.secondaryGoals || '';
          transformedData.goals.desiredOutcomes = originalGoals.desiredOutcomes || '';

          console.log('Transformed quiz data for retake:', transformedData);
          
          // Set the transformed data
          setQuizData(transformedData);
        } else {
          // Try the alternative quiz/data endpoint
          const altResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/data`, {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (altResponse.ok) {
            const altData = await altResponse.json();
            const originalData = altData.data;
            setPreviousData(originalData);
            setUserGender(originalData.personalInfo?.gender || "");
            
            // Apply same transformation logic
            const transformedData = {
              skinInfo: {
                skinType: originalData.skinInfo?.skinType || '',
                skinSensitivity: originalData.skinInfo?.skinSensitivity || '',
                skinConcerns: originalData.skinInfo?.skinConcerns || [],
                currentSkincarRoutine: originalData.skinInfo?.currentSkincarRoutine || '',
                allergies: originalData.skinInfo?.allergies || ''
              },
              lifestyleInfo: {
                stressLevel: originalData.lifestyleInfo?.stressLevel || '',
                sleepHours: originalData.lifestyleInfo?.sleepHours || '',
                waterIntake: originalData.lifestyleInfo?.waterIntake || '',
                exerciseFrequency: originalData.lifestyleInfo?.exerciseFrequency || '',
                sunExposure: originalData.lifestyleInfo?.sunExposure || '',
                smokingStatus: originalData.lifestyleInfo?.smokingStatus || ''
              },
              dietInfo: {
                dietType: originalData.dietInfo?.dietType || '',
                junkFoodFrequency: originalData.dietInfo?.junkFoodFrequency || '',
                dairyIntake: originalData.dietInfo?.dairyIntake || '',
                sugarIntake: originalData.dietInfo?.sugarIntake || '',
                fruitVeggieIntake: originalData.dietInfo?.fruitVeggieIntake || ''
              },
              menstrualInfo: {
                hasRegularCycle: originalData.menstrualInfo?.hasRegularCycle,
                skinChangesWithCycle: originalData.menstrualInfo?.skinChangesWithCycle,
                cycleRegularity: originalData.menstrualInfo?.cycleRegularity || '',
                cycleLength: originalData.menstrualInfo?.cycleLength || '',
                menstrualFlow: originalData.menstrualInfo?.menstrualFlow || '',
                pmsSymptoms: originalData.menstrualInfo?.pmsSymptoms || ''
              },
              goals: {}
            };

            // Transform goals
            const originalGoals = originalData.goals || {};
            
            if (originalGoals.primaryGoals && Array.isArray(originalGoals.primaryGoals)) {
              transformedData.goals.primaryGoal = originalGoals.primaryGoals.join(', ');
            } else {
              transformedData.goals.primaryGoal = originalGoals.primaryGoal || '';
            }

            if (originalGoals.timeExpectation) {
              transformedData.goals.shortTermGoals = originalGoals.shortTermGoals || originalGoals.timeExpectation;
              transformedData.goals.longTermGoals = originalGoals.longTermGoals || originalGoals.timeExpectation;
            } else {
              transformedData.goals.shortTermGoals = originalGoals.shortTermGoals || '';
              transformedData.goals.longTermGoals = originalGoals.longTermGoals || '';
            }

            transformedData.goals.concerns = originalGoals.concerns || '';
            transformedData.goals.secondaryGoals = originalGoals.secondaryGoals || '';
            transformedData.goals.desiredOutcomes = originalGoals.desiredOutcomes || '';

            setQuizData(transformedData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching previous quiz data:", error);
    }
  };

  const handleSectionSelection = (section, selected) => {
    if (selected) {
      setSelectedSections(prev => [...prev.filter(s => s !== section), section]);
    } else {
      setSelectedSections(prev => prev.filter(s => s !== section));
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
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Multi-step logic for selected sections
  // Track which question (across all selected sections) is being shown
  const [questionIndex, setQuestionIndex] = useState(0);

  // Build a flat list of all question components for selected sections
  const sectionComponents = {
    skinInfo: [
      <SkinTypePage key="skinType" quizData={quizData} onAnswer={handleAnswer} />, 
      <SkinSensitivityPage key="skinSensitivity" quizData={quizData} onAnswer={handleAnswer} />, 
      <SkinConcernsPage key="skinConcerns" quizData={quizData} onAnswer={handleAnswer} />
    ],
    lifestyleInfo: [<LifestylePage key="lifestyle" quizData={quizData} onAnswer={handleAnswer} />],
    dietInfo: [<DietPage key="diet" quizData={quizData} onAnswer={handleAnswer} />],
    menstrualInfo: userGender === 'female' ? [<MenstrualPage key="menstrual" quizData={quizData} onAnswer={handleAnswer} />] : [],
    goals: [<GoalsPage key="goals" quizData={quizData} onAnswer={handleAnswer} />, <TimelinePage key="timeline" quizData={quizData} onAnswer={handleAnswer} />]
  };
  const questionsToShow = selectedSections.flatMap(section => sectionComponents[section] || []);

  // Show loading screen while checking authentication and quiz status
  if (isInitialLoading) {
    return (
      <div style={{ ...styles.page, ...styles.flex, ...styles.itemsCenter, ...styles.justifyCenter }}>
        <div style={styles.textCenter}>
          <div style={styles.spinner}></div>
          <p style={{ ...styles.textGray }}>Loading your quiz data...</p>
        </div>
      </div>
    );
  }

  // If on section selection page
  if (currentPage === 1) {
    return (
      <div style={styles.page}>
        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={styles.progressFill(`${(currentPage / totalPages) * 100}%`)}></div>
        </div>

        <div style={styles.container}>
          <div style={{ ...styles.textCenter, ...styles.mb8 }}>
            <h1 style={{ ...styles.h1, ...styles.textWhite }}>Retake Quiz Sections</h1>
            <p style={styles.textGray}>
              {retakeStatus && typeof retakeStatus.totalAttempts === 'number' ? (
                <>You've completed the quiz {retakeStatus.totalAttempts} time{retakeStatus.totalAttempts > 1 ? 's' : ''}.<br /></>
              ) : null}
              Select which sections you'd like to update:
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={styles.cardNotRetakable}>
              <div style={{ ...styles.flex, ...styles.itemsCenter, ...styles.justifyBetween }}>
                <div>
                  <h3 style={{ ...styles.fontSemibold, ...styles.textWhite }}>Personal Profile</h3>
                  <p style={{ ...styles.textSm, ...styles.textGray }}>Basic personal information and demographics</p>
                </div>
                <div style={styles.textGray}>
                  <span style={{ ...styles.textSm, background: '#374151', padding: '2px 8px', borderRadius: 6 }}>Not Retakable</span>
                </div>
              </div>
            </div>

            {[
              { id: 'skinInfo', title: 'Skin Information', desc: 'Skin type, concerns, and sensitivity' },
              { id: 'lifestyleInfo', title: 'Lifestyle', desc: 'Sleep, stress, exercise, and daily habits' },
              { id: 'dietInfo', title: 'Diet & Nutrition', desc: 'Eating habits and dietary preferences' },
              ...(userGender === 'female' ? [{ id: 'menstrualInfo', title: 'Menstrual Health', desc: 'Cycle regularity and skin changes' }] : []),
              { id: 'goals', title: 'Skincare Goals', desc: 'Primary goals and expectations' }
            ].map((section) => {
              const isSelected = selectedSections.includes(section.id);
              return (
                <div
                  key={section.id}
                  style={{
                    ...styles.card,
                    ...(isSelected ? styles.cardSelected : {}),
                  }}
                >
                  <div style={{ ...styles.flex, ...styles.itemsCenter, ...styles.justifyBetween }}>
                    <div style={styles.flex1}>
                      <h3 style={{ ...styles.fontSemibold, ...styles.textWhite }}>{section.title}</h3>
                      <p style={{ ...styles.textSm, ...styles.textGray }}>{section.desc}</p>
                    </div>
                    <label style={{ ...styles.flex, ...styles.itemsCenter }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSectionSelection(section.id, e.target.checked)}
                        style={styles.checkbox}
                      />
                      <span style={{ ...styles.textSm, ...styles.textGray }}>Select</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ ...styles.flex, ...styles.justifyBetween }}>
            <button
              onClick={() => router.back()}
              style={styles.buttonBack}
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={selectedSections.length === 0}
              style={styles.buttonContinue(selectedSections.length > 0)}
            >
              Continue with Selected Sections
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step rendering for questions
  if (questionsToShow.length > 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-1">
          <div 
            className="bg-white h-1 transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / questionsToShow.length) * 100}%` }}
          ></div>
        </div>
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Update Selected Sections</h1>
            <p className="text-gray-300">
              You're updating: {selectedSections.map(s => s.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())).join(', ')}
            </p>
          </div>
          {/* Render only the current question */}
          <div className="space-y-6 mb-8">
            {questionsToShow[questionIndex]}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={() => {
                if (questionIndex === 0) {
                  setCurrentPage(1); // Go back to section selection
                } else {
                  setQuestionIndex(questionIndex - 1);
                }
              }}
              className="px-6 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {questionIndex === 0 ? 'Back to Section Selection' : 'Back'}
            </button>
            <button
              onClick={async () => {
                if (questionIndex < questionsToShow.length - 1) {
                  setQuestionIndex(questionIndex + 1);
                } else {
                  await handleSubmit();
                }
              }}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isLoading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isLoading ? 'Submitting...' : (questionIndex === questionsToShow.length - 1 ? 'Submit Retake' : 'Next')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Import question components from InitialQuiz ---
  function SkinTypePage({ quizData, onAnswer }) {
    const options = [
      { value: 'dry', label: 'dry' },
      { value: 'normal', label: 'normal' },
      { value: 'oily', label: 'oily' },
      { value: 'combination', label: 'combination' }
    ];
    return (
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-light mb-4">What is your natural skin type?</h1>
        <p className="text-gray-400 text-sm mb-12">Your skin when untreated or unstyled</p>
        <div className="flex justify-center space-x-4 flex-wrap gap-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onAnswer('skinInfo', 'skinType', option.value)}
              className={`flex flex-col items-center space-y-4 p-6 rounded-lg transition-all duration-200 min-w-[120px] ${quizData.skinInfo?.skinType === option.value ? 'bg-white/10 border border-white' : 'border border-transparent hover:border-gray-400'}`}
            >
              <div className={`w-16 h-16 rounded-full ${quizData.skinInfo?.skinType === option.value ? 'bg-white' : 'bg-gray-600'}`} />
              <span className="text-lg">{option.label}</span>
            </button>
          ))}
        </div>
        {quizData.skinInfo?.skinType && (
          <div className="mt-8 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
            <p className="text-green-400">✓ Current selection: <strong className="capitalize">{quizData.skinInfo.skinType}</strong></p>
            <p className="text-sm text-gray-400 mt-1">You can change this selection above</p>
          </div>
        )}
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
    return (
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-light mb-4">Is your skin sensitive?</h1>
        <p className="text-gray-400 text-sm mb-12">How does your skin feel without face wash</p>
        <div className="flex flex-wrap justify-center gap-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onAnswer('skinInfo', 'skinSensitivity', option.value)}
              className={`px-6 py-3 rounded-full border transition-all duration-200 ${quizData.skinInfo.skinSensitivity === option.value ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {quizData.skinInfo?.skinSensitivity && (
          <div className="mt-8 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
            <p className="text-green-400">✓ Current selection: <strong className="capitalize">{quizData.skinInfo.skinSensitivity.replace('-', ' ')}</strong></p>
            <p className="text-sm text-gray-400 mt-1">You can change this selection above</p>
          </div>
        )}
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
      { value: 'redness', label: 'Redness' }
    ];
    const currentConcerns = quizData.skinInfo.skinConcerns || [];
    const handleToggle = (value) => {
      let newConcerns;
      if (currentConcerns.includes(value)) {
        newConcerns = currentConcerns.filter(concern => concern !== value);
      } else {
        newConcerns = [...currentConcerns, value];
      }
      onAnswer('skinInfo', 'skinConcerns', newConcerns);
    };
    return (
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-light mb-8">What are your main skin concerns?</h1>
        <p className="text-gray-400 text-sm mb-8">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {options.map((option) => {
            const isSelected = currentConcerns.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className={`p-4 rounded-lg border text-center transition-all duration-200 ${isSelected ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
              >
                {option.label}
                {isSelected && <span className="ml-2">✓</span>}
              </button>
            );
          })}
        </div>
        {currentConcerns.length > 0 && (
          <div className="mt-8 p-4 bg-green-900/30 rounded-lg border border-green-500/30 max-w-2xl mx-auto">
            <p className="text-green-400">✓ Current selections: <strong>{currentConcerns.map(c => c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')).join(', ')}</strong></p>
            <p className="text-sm text-gray-400 mt-1">You can add or remove concerns above</p>
          </div>
        )}
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
      { value: 'more-than-8', label: 'More than 8 hours' }
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

    return (
      <div className="text-center space-y-12">
        <h1 className="text-3xl md:text-4xl font-light">Tell us about your lifestyle</h1>
        
        {/* Stress Level */}
        <div>
          <h3 className="text-xl mb-4">How would you rate your stress level?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {stressOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('lifestyleInfo', 'stressLevel', option.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  quizData.lifestyleInfo?.stressLevel === option.value
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Hours */}
        <div>
          <h3 className="text-xl mb-4">How many hours do you sleep?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {sleepOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('lifestyleInfo', 'sleepHours', option.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  quizData.lifestyleInfo?.sleepHours === option.value
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Water Intake */}
        <div>
          <h3 className="text-xl mb-4">How much water do you drink daily?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {waterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('lifestyleInfo', 'waterIntake', option.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  quizData.lifestyleInfo?.waterIntake === option.value
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Frequency */}
        <div>
          <h3 className="text-xl mb-4">How often do you exercise?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {exerciseOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('lifestyleInfo', 'exerciseFrequency', option.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  quizData.lifestyleInfo?.exerciseFrequency === option.value
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
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

    return (
      <div className="text-center space-y-12">
        <h1 className="text-3xl md:text-4xl font-light">About your eating habits</h1>

        {/* Diet Type */}
        <div>
          <h3 className="text-xl mb-4">What type of diet do you follow?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {dietTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('dietInfo', 'dietType', option.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  quizData.dietInfo?.dietType === option.value
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Junk Food */}
        <div>
          <h3 className="text-xl mb-4">How often do you eat junk food?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {junkFoodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('dietInfo', 'junkFoodFrequency', option.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  quizData.dietInfo?.junkFoodFrequency === option.value
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sugar Intake */}
        <div>
          <h3 className="text-xl mb-4">How would you rate your sugar intake?</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {sugarOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAnswer('dietInfo', 'sugarIntake', option.value)}
                className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                  quizData.dietInfo?.sugarIntake === option.value
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Current selections summary */}
        {(quizData.dietInfo?.dietType || quizData.dietInfo?.junkFoodFrequency || quizData.dietInfo?.sugarIntake) && (
          <div className="mt-8 p-4 bg-green-900/30 rounded-lg border border-green-500/30 max-w-2xl mx-auto">
            <p className="text-green-400 font-semibold mb-2">✓ Current Diet Profile:</p>
            <div className="text-sm text-gray-300 space-y-1">
              {quizData.dietInfo?.dietType && <p>Diet Type: <strong className="capitalize">{quizData.dietInfo.dietType.replace('-', ' ')}</strong></p>}
              {quizData.dietInfo?.junkFoodFrequency && <p>Junk Food: <strong className="capitalize">{quizData.dietInfo.junkFoodFrequency}</strong></p>}
              {quizData.dietInfo?.sugarIntake && <p>Sugar Intake: <strong className="capitalize">{quizData.dietInfo.sugarIntake.replace('-', ' ')}</strong></p>}
            </div>
            <p className="text-xs text-gray-400 mt-2">You can update any of these selections above</p>
          </div>
        )}
      </div>
    );
  }
  function MenstrualPage({ quizData, onAnswer }) {
    const handleMenstrualChange = (field, value) => {
      onAnswer('menstrualInfo', field, value);
    };

    // Convert boolean values from InitialQuiz to string values for RetakeQuiz
    const getCycleRegularityValue = () => {
      if (quizData.menstrualInfo.cycleRegularity) {
        return quizData.menstrualInfo.cycleRegularity;
      }
      // Convert from InitialQuiz boolean format
      if (quizData.menstrualInfo.hasRegularCycle === true) {
        return 'regular';
      } else if (quizData.menstrualInfo.hasRegularCycle === false) {
        return 'irregular';
      }
      return '';
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Menstrual Health</h2>
          <p className="text-gray-300 text-sm mb-4">Tell us about your menstrual cycle</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Cycle Regularity <span className="text-red-400">*</span></h3>
            <select
              value={getCycleRegularityValue()}
              onChange={(e) => handleMenstrualChange('cycleRegularity', e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
            >
              <option value="">Select cycle regularity</option>
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
              <option value="not-sure">Not sure</option>
            </select>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Cycle Length</h3>
            <input
              type="text"
              value={quizData.menstrualInfo.cycleLength || ""}
              onChange={(e) => handleMenstrualChange('cycleLength', e.target.value)}
              placeholder="Average days in cycle"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Menstrual Flow</h3>
            <select
              value={quizData.menstrualInfo.menstrualFlow || ""}
              onChange={(e) => handleMenstrualChange('menstrualFlow', e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
            >
              <option value="">Select flow level</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">PMS Symptoms</h3>
            <input
              type="text"
              value={quizData.menstrualInfo.pmsSymptoms || ""}
              onChange={(e) => handleMenstrualChange('pmsSymptoms', e.target.value)}
              placeholder="e.g., cramps, mood swings"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 md:col-span-2">
            <h3 className="font-semibold text-white mb-2">Skin Changes with Cycle</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="skinChanges"
                  value="true"
                  checked={quizData.menstrualInfo.skinChangesWithCycle === true}
                  onChange={(e) => handleMenstrualChange('skinChangesWithCycle', e.target.value === 'true')}
                  className="mr-2"
                />
                <span className="text-white">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="skinChanges"
                  value="false"
                  checked={quizData.menstrualInfo.skinChangesWithCycle === false}
                  onChange={(e) => handleMenstrualChange('skinChangesWithCycle', e.target.value === 'true')}
                  className="mr-2"
                />
                <span className="text-white">No</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Current selections summary */}
        {(getCycleRegularityValue() || quizData.menstrualInfo.cycleLength || quizData.menstrualInfo.menstrualFlow || quizData.menstrualInfo.pmsSymptoms) && (
          <div className="mt-6 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
            <p className="text-green-400 font-semibold mb-2">✓ Current Menstrual Profile:</p>
            <div className="text-sm text-gray-300 space-y-1">
              {getCycleRegularityValue() && <p>Cycle Regularity: <strong className="capitalize">{getCycleRegularityValue().replace('-', ' ')}</strong></p>}
              {quizData.menstrualInfo.cycleLength && <p>Cycle Length: <strong>{quizData.menstrualInfo.cycleLength} days</strong></p>}
              {quizData.menstrualInfo.menstrualFlow && <p>Flow: <strong className="capitalize">{quizData.menstrualInfo.menstrualFlow}</strong></p>}
              {quizData.menstrualInfo.pmsSymptoms && <p>PMS Symptoms: <strong>{quizData.menstrualInfo.pmsSymptoms}</strong></p>}
              {quizData.menstrualInfo.skinChangesWithCycle !== undefined && <p>Skin Changes with Cycle: <strong>{quizData.menstrualInfo.skinChangesWithCycle ? 'Yes' : 'No'}</strong></p>}
            </div>
            <p className="text-xs text-gray-400 mt-2">You can update any of these details above</p>
          </div>
        )}
      </div>
    );
  }
  function GoalsPage({ quizData, onAnswer }) {
    const [customPrimaryGoal, setCustomPrimaryGoal] = useState('');
    const [customConcerns, setCustomConcerns] = useState('');
    
    const primaryGoalOptions = [
      'Reduce acne',
      'Even skin tone',
      'Reduce wrinkles',
      'Hydrate skin',
      'Reduce oiliness',
      'Brighten complexion',
      'Other'
    ];
    const concernsOptions = [
      'Sensitive skin',
      'Hormonal acne',
      'Pigmentation',
      'Redness',
      'Dryness',
      'Other'
    ];

    // Initialize custom inputs if current value is not in predefined options
    useEffect(() => {
      if (quizData.goals?.primaryGoal && !primaryGoalOptions.includes(quizData.goals.primaryGoal)) {
        setCustomPrimaryGoal(quizData.goals.primaryGoal);
      }
      if (quizData.goals?.concerns && !concernsOptions.includes(quizData.goals.concerns)) {
        setCustomConcerns(quizData.goals.concerns);
      }
    }, [quizData.goals?.primaryGoal, quizData.goals?.concerns]);

    const handlePrimaryGoalChange = (value) => {
      if (primaryGoalOptions.includes(value)) {
        setCustomPrimaryGoal('');
        onAnswer('goals', 'primaryGoal', value);
      } else {
        setCustomPrimaryGoal(value);
        onAnswer('goals', 'primaryGoal', value);
      }
    };

    const handleConcernsChange = (value) => {
      if (concernsOptions.includes(value)) {
        setCustomConcerns('');
        onAnswer('goals', 'concerns', value);
      } else {
        setCustomConcerns(value);
        onAnswer('goals', 'concerns', value);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Skincare Goals</h2>
          <p className="text-gray-300 text-sm mb-4">What are your main skincare goals?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Primary Goal <span className="text-red-400">*</span></h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {primaryGoalOptions.slice(0, -1).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handlePrimaryGoalChange(option)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${quizData.goals?.primaryGoal === option ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customPrimaryGoal}
              onChange={e => {
                setCustomPrimaryGoal(e.target.value);
                onAnswer('goals', 'primaryGoal', e.target.value);
              }}
              placeholder="Other (please specify)"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
              minLength={2}
              maxLength={100}
            />
            {!quizData.goals?.primaryGoal && (
              <p className="text-red-400 text-xs mt-1">Primary goal is required</p>
            )}
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Secondary Goals</h3>
            <input
              type="text"
              value={quizData.goals?.secondaryGoals || ''}
              onChange={e => onAnswer('goals', 'secondaryGoals', e.target.value)}
              placeholder="e.g., even skin tone, reduce wrinkles"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
              maxLength={200}
            />
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Concerns <span className="text-red-400">*</span></h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {concernsOptions.slice(0, -1).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleConcernsChange(option)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${quizData.goals?.concerns === option ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customConcerns}
              onChange={e => {
                setCustomConcerns(e.target.value);
                onAnswer('goals', 'concerns', e.target.value);
              }}
              placeholder="Other (please specify)"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
              minLength={2}
              maxLength={100}
            />
            {!quizData.goals?.concerns && (
              <p className="text-red-400 text-xs mt-1">Concerns field is required</p>
            )}
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Desired Outcomes</h3>
            <input
              type="text"
              value={quizData.goals?.desiredOutcomes || ''}
              onChange={e => onAnswer('goals', 'desiredOutcomes', e.target.value)}
              placeholder="e.g., clearer skin, fewer breakouts"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
              maxLength={200}
            />
          </div>
        </div>
      </div>
    );
  }

  function TimelinePage({ quizData, onAnswer }) {
    const [customShortTerm, setCustomShortTerm] = useState('');
    const [customLongTerm, setCustomLongTerm] = useState('');
    
    const shortTermOptions = [
      'Within 1 month',
      'Within 3 months',
      'Within 6 months',
      'Other'
    ];
    const longTermOptions = [
      'Within 6 months',
      'Within 1 year',
      'More than 1 year',
      'Other'
    ];

    // Initialize custom inputs if current value is not in predefined options
    useEffect(() => {
      if (quizData.goals?.shortTermGoals && !shortTermOptions.includes(quizData.goals.shortTermGoals)) {
        setCustomShortTerm(quizData.goals.shortTermGoals);
      }
      if (quizData.goals?.longTermGoals && !longTermOptions.includes(quizData.goals.longTermGoals)) {
        setCustomLongTerm(quizData.goals.longTermGoals);
      }
    }, [quizData.goals?.shortTermGoals, quizData.goals?.longTermGoals]);

    const handleShortTermChange = (value) => {
      if (shortTermOptions.includes(value)) {
        setCustomShortTerm('');
        onAnswer('goals', 'shortTermGoals', value);
      } else {
        setCustomShortTerm(value);
        onAnswer('goals', 'shortTermGoals', value);
      }
    };

    const handleLongTermChange = (value) => {
      if (longTermOptions.includes(value)) {
        setCustomLongTerm('');
        onAnswer('goals', 'longTermGoals', value);
      } else {
        setCustomLongTerm(value);
        onAnswer('goals', 'longTermGoals', value);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Timeline for Goals</h2>
          <p className="text-gray-300 text-sm mb-4">When would you like to achieve these goals?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Short-term Goals <span className="text-red-400">*</span></h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {shortTermOptions.slice(0, -1).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleShortTermChange(option)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${quizData.goals?.shortTermGoals === option ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customShortTerm}
              onChange={e => {
                setCustomShortTerm(e.target.value);
                onAnswer('goals', 'shortTermGoals', e.target.value);
              }}
              placeholder="Other (please specify)"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
              minLength={2}
              maxLength={100}
            />
            {!quizData.goals?.shortTermGoals && (
              <p className="text-red-400 text-xs mt-1">Short-term goals are required</p>
            )}
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <h3 className="font-semibold text-white mb-2">Long-term Goals <span className="text-red-400">*</span></h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {longTermOptions.slice(0, -1).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleLongTermChange(option)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 ${quizData.goals?.longTermGoals === option ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customLongTerm}
              onChange={e => {
                setCustomLongTerm(e.target.value);
                onAnswer('goals', 'longTermGoals', e.target.value);
              }}
              placeholder="Other (please specify)"
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-white focus:outline-none"
              minLength={2}
              maxLength={100}
            />
            {!quizData.goals?.longTermGoals && (
              <p className="text-red-400 text-xs mt-1">Long-term goals are required</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null; // This line should never be reached
}
