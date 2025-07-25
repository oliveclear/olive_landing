'use client';
import { useState, useEffect } from 'react';
import { Outfit } from "next/font/google";
import { useRouter, useParams } from 'next/navigation';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

const BlogPostPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();

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
    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/blog/${params.id}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();

      if (data.success) {
        setBlog(data.blog);
      } else {
        setError(data.message || 'Blog not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.pageContainer(isMobile, isTablet)}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={styles.pageContainer(isMobile, isTablet)}>
        <div style={styles.errorContainer}>
          <h1 style={styles.errorTitle}>Article Not Found</h1>
          <p style={styles.errorText}>
            {error || 'The article you are looking for does not exist.'}
          </p>
          <button 
            onClick={() => router.push('/Blog')}
            style={styles.backButton}
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer(isMobile, isTablet)}>
      {/* Back Button */}
      <button 
        onClick={() => router.push('/Blog')}
        style={styles.backButtonTop}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Blog
      </button>

      {/* Article Container */}
      <article style={styles.articleContainer(isMobile, isTablet)}>
        {/* Article Header */}
        <header style={styles.articleHeader}>
          <div style={styles.articleMeta}>
            <span style={styles.dateText}>
              {formatDate(blog.createdAt)}
            </span>
          </div>
          
          <h1 style={styles.articleTitle(isMobile, isTablet)}>
            {blog.title}
          </h1>
        </header>

        {/* Featured Image */}
        <div style={styles.imageContainer(isMobile)}>
          <img 
            src={blog.image} 
            alt={blog.title}
            style={styles.articleImage}
            onError={(e) => {
              e.target.src = '/placeholder-blog.jpg';
            }}
          />
        </div>

        {/* Article Content */}
        <div style={styles.articleContent(isMobile, isTablet)}>
          <div style={styles.descriptionText(isMobile, isTablet)}>
            {blog.description.split('\n').map((paragraph, index) => (
              <p key={index} style={styles.paragraph(isMobile)}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Article Footer */}
        <footer style={styles.articleFooter}>
          <div style={styles.shareSection}>
            <h3 style={styles.shareTitle}>Share this article</h3>
            <div style={styles.shareButtons}>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: blog.title,
                      text: blog.description.substring(0, 100) + '...',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                style={styles.shareButton}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>
          </div>
        </footer>
      </article>

      {/* Related/Navigation */}
      <div style={styles.navigationSection}>
        <button 
          onClick={() => router.push('/Blog')}
          style={styles.backToListButton}
        >
          ← Back to All Articles
        </button>
      </div>
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

  backButtonTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: '1px solid #444',
    borderRadius: '25px',
    padding: '10px 20px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '32px',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: '#CEDF9F',
      color: '#CEDF9F',
    }
  },

  articleContainer: (isMobile, isTablet) => ({
    maxWidth: isMobile ? '100%' : isTablet ? '700px' : '800px',
    margin: '0 auto',
    backgroundColor: '#2a2a2a',
    borderRadius: '24px',
    overflow: 'hidden',
    marginBottom: '48px',
  }),

  articleHeader: {
    padding: '48px 32px 32px',
    textAlign: 'center',
  },

  articleMeta: {
    marginBottom: '16px',
  },

  dateText: {
    fontSize: '14px',
    color: '#CEDF9F',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  articleTitle: (isMobile, isTablet) => ({
    fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    lineHeight: '1.2',
  }),

  imageContainer: (isMobile) => ({
    width: '100%',
    height: isMobile ? '250px' : '400px',
    overflow: 'hidden',
    position: 'relative',
  }),

  articleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  articleContent: (isMobile, isTablet) => ({
    padding: isMobile ? '32px 24px' : '48px 48px',
  }),

  descriptionText: (isMobile, isTablet) => ({
    fontSize: isMobile ? '16px' : '18px',
    lineHeight: '1.8',
    color: '#e0e0e0',
  }),

  paragraph: (isMobile) => ({
    marginBottom: '24px',
    textAlign: 'justify',
  }),

  articleFooter: {
    padding: '32px 48px 48px',
    borderTop: '1px solid #444',
  },

  shareSection: {
    textAlign: 'center',
  },

  shareTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '16px',
  },

  shareButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },

  shareButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    }
  },

  navigationSection: {
    textAlign: 'center',
    marginBottom: '48px',
  },

  backToListButton: {
    background: 'transparent',
    border: '2px solid #CEDF9F',
    borderRadius: '25px',
    padding: '16px 32px',
    color: '#CEDF9F',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#CEDF9F',
      color: '#171717',
    }
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
    padding: '80px 20px',
  },

  errorTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '16px',
  },

  errorText: {
    fontSize: '18px',
    color: '#888',
    marginBottom: '32px',
    maxWidth: '400px',
    margin: '0 auto 32px',
  },

  backButton: {
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    border: 'none',
    borderRadius: '25px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    }
  },
};

export default BlogPostPage;
