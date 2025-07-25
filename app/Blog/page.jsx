'use client';
import { useState, useEffect } from 'react';
import { Outfit } from "next/font/google";
import { useRouter } from 'next/navigation';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

const BlogsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [reels, setReels] = useState([]);
  const [reelsLoading, setReelsLoading] = useState(true);
  const [reelsError, setReelsError] = useState(null);
  const [showReelModal, setShowReelModal] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false); // NEW
  const router = useRouter();

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
    fetchBlogs();
    fetchReels();
  }, [currentPage, searchTerm]);

  // Show tutorial overlay for 5 seconds when modal opens
  useEffect(() => {
    if (showReelModal) {
      setShowTutorial(true);
      const timer = setTimeout(() => setShowTutorial(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showReelModal, activeReelIndex]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/blog?${params}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchReels = async () => {
    try {
      setReelsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/reels`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      if (data.success) {
        setReels(data.reels);
      } else {
        setReelsError(data.message || 'Failed to fetch reels');
      }
    } catch (error) {
      setReelsError('Failed to fetch reels');
    } finally {
      setReelsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Reels modal for mobile (WhatsApp status style)
  const ReelModal = ({ index }) => {
    if (!reels[index]) return null;
    return (
      <div style={styles.reelModalOverlay} onClick={() => setShowReelModal(false)}>
        <div style={styles.reelModalContent} onClick={e => e.stopPropagation()}>
          {/* Cross button for mobile */}
          {isMobile && (
            <button
              style={styles.closeButton}
              onClick={() => setShowReelModal(false)}
              aria-label="Close"
            >
              &#10005;
            </button>
          )}
          <video
            src={reels[index].videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={styles.reelModalVideo}
          />
          {/* Left tap area */}
          <div
            style={styles.reelModalLeft}
            onClick={e => {
              e.stopPropagation();
              setActiveReelIndex(i => (i > 0 ? i - 1 : i));
            }}
          />
          {/* Right tap area */}
          <div
            style={styles.reelModalRight}
            onClick={e => {
              e.stopPropagation();
              setActiveReelIndex(i => (i < reels.length - 1 ? i + 1 : i));
            }}
          />
        </div>
      </div>
    );
  };

  if (loading && blogs.length === 0) {
    return (
      <div style={styles.pageContainer(isMobile, isTablet)}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading educational content...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer(isMobile, isTablet)}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <h1 style={styles.pageTitle(isMobile, isTablet)}>explore</h1>
        <p style={styles.pageSubtitle(isMobile, isTablet)}>
          discover the latest tips, trends, and insights for healthy, glowing skin
        </p>
      </div>

      
      {/* Reels Bar */}
      <h1 style={styles.pageSubtitle1(isMobile, isTablet)}>reels</h1>
      <div style={styles.reelsBarWrapper}>
        {reelsLoading ? (
          <div style={styles.reelsLoading}>Loading reels...</div>
        ) : reelsError ? (
          <div style={styles.reelsError}>{reelsError}</div>
        ) : reels.length > 0 ? (
          <div style={styles.reelsBar(isMobile)}>
            {reels.map((reel, idx) => (
              <div
                key={reel._id}
                style={styles.reelThumb(isMobile)}
                onClick={() => {
                  setActiveReelIndex(idx);
                  setShowReelModal(true);
                }}
              >
                <video
                  src={reel.videoUrl}
                  style={styles.reelVideoThumb}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.reelsEmpty}>No reels yet</div>
        )}
      </div>
      {showReelModal && (
        <div style={styles.reelModalOverlay} onClick={() => setShowReelModal(false)}>
          <div style={styles.reelModalContent} onClick={e => e.stopPropagation()}>
            {/* Cross button for all devices */}
            <button
              style={styles.closeButton}
              onClick={e => {
                e.stopPropagation();
                setShowReelModal(false);
              }}
              aria-label="Close"
            >
              &#10005;
            </button>
            {/* Tutorial overlay for navigation (all devices) */}
            {showTutorial && (
              <div style={styles.tutorialOverlay}>
                <span style={styles.tutorialText}>
                  Tap/click left or right to view next/previous reel
                </span>
                <div style={styles.tutorialArrows}>
                  <span style={styles.arrow}>&#8592;</span>
                  <span style={styles.arrow}>&#8594;</span>
                </div>
              </div>
            )}
            <video
              src={reels[activeReelIndex]?.videoUrl}
              style={styles.reelModalVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            {/* Left tap area */}
            <div
              style={styles.reelModalLeft}
              onClick={e => {
                e.stopPropagation();
                setActiveReelIndex(i => (i > 0 ? i - 1 : i));
              }}
            />
            {/* Right tap area */}
            <div
              style={styles.reelModalRight}
              onClick={e => {
                e.stopPropagation();
                setActiveReelIndex(i => (i < reels.length - 1 ? i + 1 : i));
              }}
            />
          </div>
        </div>
      )}


      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button onClick={fetchBlogs} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <h1 style={styles.pageSubtitle1(isMobile, isTablet)}>blogs</h1>
        {/* Search Section */}
      <form onSubmit={handleSearch} style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput(isMobile)}
          />
          <button type="submit" style={styles.searchButton(isMobile, isTablet)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </form>
      </div>
      

      {/* Blogs Grid */}
      {blogs.length > 0 ? (
        <>
          <div style={styles.blogsGrid(isMobile, isTablet)}>
            {blogs.map((blog) => (
              <article key={blog._id} style={styles.blogCard(isMobile)}>
                <div style={styles.imageContainer}>
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    style={styles.blogImage}
                    onError={(e) => {
                      e.target.src = '/placeholder-blog.jpg'; // Fallback image
                    }}
                  />
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.cardMeta}>
                    <span style={styles.dateText}>
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                  <h2 style={styles.blogTitle(isMobile)}>
                    {blog.title}
                  </h2>
                  <p style={styles.blogDescription(isMobile)}>
                    {truncateText(blog.description, isMobile ? 120 : 150)}
                  </p>
                  <button 
                    onClick={() => router.push(`/Blog/${blog._id}`)}
                    style={styles.readMoreButton(isMobile)}
                  >
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div style={styles.paginationContainer}>
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={!pagination.hasPrev}
                style={{
                  ...styles.paginationButton,
                  ...(pagination.hasPrev ? {} : styles.paginationButtonDisabled)
                }}
              >
                Previous
              </button>
              
              <span style={styles.pageInfo}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNext}
                style={{
                  ...styles.paginationButton,
                  ...(pagination.hasNext ? {} : styles.paginationButtonDisabled)
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No blogs found</h3>
            <p style={styles.emptyText}>
              {searchTerm 
                ? `No articles match "${searchTerm}". Try a different search term.`
                : 'No blog articles are available at the moment.'
              }
            </p>
          </div>
        )
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
    marginTop: isMobile ? '60px' : isTablet ? '80px' : '100px',
    padding: isMobile ? '16px' : '24px',
  }),

  headerSection: {
    textAlign: 'left',
    marginBottom: '48px',
  },

  pageTitle: (isMobile, isTablet) => ({
    fontSize: isMobile ? '32px' : isTablet ? '40px' : '48px',
    fontWeight: 700,
    margin: '0 0 0 0',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }),

  pageSubtitle: (isMobile, isTablet) => ({
    fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
    fontWeight: 400,
    margin: 0,
    color: '#aaaaaa',
    maxWidth: '600px',
    marginLeft: '0px',
    // marginRight: 'auto',
  }),

  pageSubtitle1: (isMobile, isTablet) => ({
    fontSize: isMobile ? '20px' : isTablet ? '32px' : '40px',
    fontWeight: 400,
    margin: 0,
    color: '#aaaaaa',
    maxWidth: '600px',
    marginLeft: '0px',
    // marginRight: 'auto',
  }),

  searchSection: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'right',
  },

  searchContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
  },

  searchInput: (isMobile) => ({
    width: '100%',
    padding: isMobile ? '7px 14px 7px 14px' : '16px 60px 16px 24px',
    borderRadius: '50px',
    border: '2px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#CEDF9F',
    }
  }),

  searchButton: (isMobile, isTablet) => ({
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    border: 'none',
    borderRadius: '50%',
    width: isMobile ? '35px' : '40px',
    height: isMobile ? '35px' : '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#171717',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-50%) scale(1.05)',
    }
  }),

  blogsGrid: (isMobile, isTablet) => ({
    display: 'grid',
    gridTemplateColumns: isMobile 
      ? '1fr' 
      : isTablet 
        ? 'repeat(2, 1fr)' 
        : 'repeat(3, 1fr)',
    gap: isMobile ? '24px' : '32px',
    marginBottom: '48px',
  }),

  blogCard: (isMobile) => ({
    backgroundColor: '#2a2a2a',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    }
  }),

  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    position: 'relative',
  },

  blogImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },

  cardContent: {
    padding: '24px',
  },

  cardMeta: {
    marginBottom: '12px',
  },

  dateText: {
    fontSize: '14px',
    color: '#888',
    fontWeight: '500',
  },

  blogTitle: (isMobile) => ({
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  }),

  blogDescription: (isMobile) => ({
    fontSize: isMobile ? '14px' : '16px',
    color: '#ccc',
    lineHeight: '1.6',
    margin: '0 0 20px 0',
  }),

  readMoreButton: (isMobile) => ({
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    border: 'none',
    borderRadius: '25px',
    padding: isMobile ? '10px 20px' : '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    }
  }),

  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '48px',
  },

  paginationButton: {
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },

  paginationButtonDisabled: {
    background: '#333',
    color: '#666',
    cursor: 'not-allowed',
  },

  pageInfo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #333',
    borderTop: '4px solid #CEDF9F',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    marginTop: '16px',
    color: '#888',
    fontSize: '16px',
  },

  errorContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#2a1f1f',
    borderRadius: '16px',
    margin: '20px 0',
  },

  errorText: {
    color: '#ff6b6b',
    fontSize: '16px',
    marginBottom: '16px',
  },

  retryButton: {
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },

  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '12px',
  },

  emptyText: {
    fontSize: '16px',
    color: '#888',
    maxWidth: '400px',
    margin: '0 auto',
  },

  reelsBarWrapper: {
    marginBottom: '32px',
    width: '100%',
    overflowX: 'auto',
  },
  reelsBar: (isMobile) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: isMobile ? '5px' : '10px',
    overflowX: 'auto',
    padding: '8px 0',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth', // NEW: smooth scrolling
  }),
  reelThumb: (isMobile) => ({
    minWidth: isMobile ? '110px' : '180px',
    height: isMobile ? '210px' : '260px', // Increased height for mobile
    borderRadius: '18px',
    background: '#232323',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    scrollSnapAlign: 'start',
  }),
  reelVideoThumb: {
    width: '100%',
    height: '100%', // Fill the entire thumb
    objectFit: 'cover',
    borderRadius: '18px',
    background: '#111',
  },
  // Remove reelTitle background if no title
  reelTitle: {
    display: 'none',
  },
  reelsLoading: {
    color: '#aaa',
    fontSize: '16px',
    padding: '20px',
  },
  reelsError: {
    color: '#ff6b6b',
    fontSize: '16px',
    padding: '20px',
  },
  reelsEmpty: {
    color: '#888',
    fontSize: '16px',
    padding: '20px',
  },
  reelModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.95)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reelModalContent: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reelModalVideo: {
    maxWidth: '100vw',
    maxHeight: '100vh',
    borderRadius: '12px',
    background: '#000',
  },
  reelModalLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '40vw',
    height: '100vh',
    zIndex: 2,
  },
  reelModalRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '40vw',
    height: '100vh',
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: '18px',
    right: '18px',
    zIndex: 10,
    background: 'rgba(23,23,23,0.7)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '38px',
    height: '38px',
    fontSize: '22px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'background 0.2s',
  },
  tutorialOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    pointerEvents: 'none',
    zIndex: 11,
    paddingBottom: 40,
  },
  tutorialText: {
    color: '#fff',
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: '8px 18px',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 500,
  },
  tutorialArrows: {
    display: 'flex',
    gap: 24,
    marginBottom: 18,
  },
  arrow: {
    color: '#CEDF9F',
    fontSize: 32,
    fontWeight: 700,
    background: 'rgba(0,0,0,0.4)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default BlogsPage;
