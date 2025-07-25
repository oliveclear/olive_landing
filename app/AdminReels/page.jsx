'use client';
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const AdminReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/reels`);
      const data = await res.json();
      if (data.success) setReels(data.reels);
      else setError(data.message || 'Failed to fetch reels');
    } catch (err) {
      setError('Failed to fetch reels');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !video) {
      setUploadError('Title and video are required');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('video', video);
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/reels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setVideo(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchReels();
      } else {
        setUploadError(data.message || 'Upload failed');
      }
    } catch (err) {
      setUploadError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reel?')) return;
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/reels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) fetchReels();
      else alert(data.message || 'Delete failed');
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin: Manage Reels</h1>
      <form onSubmit={handleUpload} style={styles.form}>
        <input
          type="text"
          placeholder="Reel title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={e => setVideo(e.target.files[0])}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Reel'}
        </button>
        {uploadError && <div style={styles.error}>{uploadError}</div>}
      </form>
      <hr style={{margin: '32px 0', borderColor: '#333'}} />
      <h2 style={styles.subheading}>All Reels</h2>
      {loading ? (
        <div>Loading reels...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div style={styles.reelsGrid}>
          {reels.map(reel => (
            <div key={reel._id} style={styles.reelCard}>
              <video src={process.env.NEXT_PUBLIC_URL_HOST + reel.videoUrl} style={styles.reelVideo} controls />
              <div style={styles.reelTitle}>{reel.title}</div>
              <button style={styles.deleteButton} onClick={() => handleDelete(reel._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 800,
    margin: '40px auto',
    background: '#181818',
    color: '#e0e0e0',
    borderRadius: 16,
    padding: 32,
    fontFamily: 'Outfit, sans-serif',
    boxShadow: '0 2px 16px rgba(0,0,0,0.15)'
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 24,
    color: '#CEDF9F',
    textAlign: 'center'
  },
  subheading: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 16,
    color: '#CEDF9F',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #333',
    background: '#232323',
    color: '#fff',
    fontSize: 16
  },
  button: {
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 8
  },
  error: {
    color: '#ff6b6b',
    marginTop: 8
  },
  reelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 24
  },
  reelCard: {
    background: '#232323',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
  },
  reelVideo: {
    width: '100%',
    maxHeight: 180,
    borderRadius: 8,
    marginBottom: 8,
    background: '#111'
  },
  reelTitle: {
    fontWeight: 600,
    color: '#CEDF9F',
    marginBottom: 8,
    textAlign: 'center'
  },
  deleteButton: {
    background: '#ff6b6b',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8
  }
};

export default AdminReels;
