'use client';
import { useState, useEffect } from 'react';
import { Outfit } from "next/font/google";
import Cookies from 'js-cookie';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

const AdminBlogPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '', // Will be replaced by file
    status: 'published',
  });
  const [imageFile, setImageFile] = useState(null);

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
  }, [currentPage, searchTerm, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/blog/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('No authentication token found');
        return;
      }
      const url = editingBlog 
        ? `${process.env.NEXT_PUBLIC_URL_HOST}/blog/admin/${editingBlog._id}`
        : `${process.env.NEXT_PUBLIC_URL_HOST}/blog/admin/create`;
      const method = editingBlog ? 'PUT' : 'POST';
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('status', formData.status);
      if (imageFile) {
        form.append('image', imageFile);
      } else if (formData.image && !formData.image.startsWith('blob:')) {
        // fallback for URL (backward compatibility)
        form.append('image', formData.image);
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: form
      });
      const data = await response.json();
      if (data.success) {
        alert(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        setShowModal(false);
        resetForm();
        setImageFile(null);
        fetchBlogs();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/blog/admin/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Blog deleted successfully!');
        fetchBlogs();
      } else {
        alert(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        description: blog.description,
        image: blog.image,
        status: blog.status
      });
    } else {
      setEditingBlog(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      status: 'published'
    });
    setEditingBlog(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.pageContainer(isMobile, isTablet)}>
      {/* Header */}
      <div style={styles.headerSection}>
        <h1 style={styles.pageTitle(isMobile, isTablet)}>Blog Management</h1>
        <button 
          onClick={() => openModal()}
          style={styles.addButton}
        >
          + Add New Blog
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filtersSection}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.statusFilter}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p>Loading blogs...</p>
        </div>
      ) : (
        <>
          {/* Blogs Table */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        style={styles.thumbnailImage}
                        onError={(e) => {
                          e.target.src = '/placeholder-blog.jpg';
                        }}
                      />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.titleCell}>
                        <h3 style={styles.blogTitle}>{blog.title}</h3>
                        <p style={styles.blogDescription}>
                          {blog.description.length > 100 
                            ? blog.description.substring(0, 100) + '...'
                            : blog.description
                          }
                        </p>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...(blog.status === 'published' 
                          ? styles.statusPublished 
                          : styles.statusDraft
                        )
                      }}>
                        {blog.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {formatDate(blog.createdAt)}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => openModal(blog)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(blog._id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingBlog ? 'Edit Blog' : 'Add New Blog'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  style={styles.input}
                  required={!editingBlog}
                />
                {/* Show preview if editing or selected */}
                {(imageFile || formData.image) && (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                    alt="Preview"
                    style={{ width: 80, height: 80, objectFit: 'cover', marginTop: 8, borderRadius: 8 }}
                  />
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={styles.textarea}
                  rows="6"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={styles.select}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={styles.saveButton}
                >
                  {editingBlog ? 'Update' : 'Create'} Blog
                </button>
              </div>
            </form>
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
    marginTop: isMobile ? '60px' : isTablet ? '80px' : '100px',
    padding: isMobile ? '16px' : '24px',
  }),

  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },

  pageTitle: (isMobile, isTablet) => ({
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
    fontWeight: 700,
    margin: 0,
    color: '#ffffff',
  }),

  addButton: {
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  filtersSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },

  searchInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '14px',
    minWidth: '200px',
  },

  statusFilter: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '14px',
  },

  tableContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  tableHeader: {
    backgroundColor: '#333',
  },

  th: {
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#fff',
    borderBottom: '1px solid #444',
  },

  tableRow: {
    borderBottom: '1px solid #444',
    ':hover': {
      backgroundColor: '#333',
    }
  },

  td: {
    padding: '16px',
    verticalAlign: 'top',
  },

  thumbnailImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
  },

  titleCell: {
    maxWidth: '300px',
  },

  blogTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#fff',
  },

  blogDescription: {
    fontSize: '14px',
    color: '#aaa',
    margin: 0,
    lineHeight: '1.4',
  },

  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  statusPublished: {
    backgroundColor: '#2d5a2d',
    color: '#4CAF50',
  },

  statusDraft: {
    backgroundColor: '#4a4a2d',
    color: '#FFC107',
  },

  actionButtons: {
    display: 'flex',
    gap: '8px',
  },

  editButton: {
    background: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  deleteButton: {
    background: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '24px',
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

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modal: {
    backgroundColor: '#2a2a2a',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #444',
  },

  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },

  closeButton: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
  },

  form: {
    padding: '24px',
  },

  formGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },

  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '14px',
  },

  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },

  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '14px',
  },

  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },

  cancelButton: {
    background: 'transparent',
    border: '1px solid #666',
    borderRadius: '8px',
    padding: '12px 24px',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },

  saveButton: {
    background: 'linear-gradient(135deg, #CEDF9F 0%, #a8c668 100%)',
    color: '#171717',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #333',
    borderTop: '4px solid #CEDF9F',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  errorContainer: {
    backgroundColor: '#2a1f1f',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },

  errorText: {
    color: '#ff6b6b',
    margin: 0,
  },
};

export default AdminBlogPage;
