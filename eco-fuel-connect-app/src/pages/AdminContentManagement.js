import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Table,
  Badge,
  Spinner,
  Modal,
  Alert
} from "react-bootstrap";

function AdminContentManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'Biogas Basics',
    tags: '',
    published: false,
    featured: false,
    imageUrl: ''
  });

  const categories = ['Biogas Basics', 'Waste Management', 'Environment & Health', 'Community Impact', 'Innovation', 'Getting Started'];

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/content').catch(() => ({ ok: false, status: 0 }));
      
      if (!response.ok) {
        if (response.status === 0) {
          showAlert('Backend server is not running. Please start the server.', 'warning');
        }
        setPosts([]);
        setLoading(false);
        return;
      }
      
      const contentType = response.headers?.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setPosts([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingPost ? `/api/content/${editingPost._id}` : '/api/content';
      const method = editingPost ? 'PUT' : 'POST';
      
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      }).catch(() => ({ ok: false, status: 0 }));

      if (!response.ok) {
        if (response.status === 0) {
          showAlert('Backend server is not running. Please start the server.', 'danger');
          return;
        }
        const contentType = response.headers?.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          showAlert(data.error || 'Error saving post', 'danger');
        } else {
          showAlert('Server error - please try again later', 'danger');
        }
        return;
      }

      const data = await response.json();
      showAlert(editingPost ? 'Post updated successfully!' : 'Post created successfully!', 'success');
      setShowModal(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      showAlert('Network error - please check your connection', 'danger');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      summary: post.summary,
      category: post.category,
      tags: post.tags.join(', '),
      published: post.published,
      featured: post.featured,
      imageUrl: post.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/content/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showAlert('Post deleted successfully!', 'success');
        fetchPosts();
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          showAlert(data.error || 'Error deleting post', 'danger');
        } else {
          showAlert('Server error - please try again later', 'danger');
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showAlert('Network error - please check your connection', 'danger');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'Biogas Basics',
      tags: '',
      published: false,
      featured: false,
      imageUrl: ''
    });
    setEditingPost(null);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{background: '#F9FAFB', minHeight: '100vh', paddingTop: '20px', paddingBottom: '20px'}}>
      <Container fluid>
        {/* Alert */}
        {alert.show && (
          <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
            {alert.message}
          </Alert>
        )}

        {/* Header */}
        <Row className="mb-4 align-items-center">
          <Col md="8">
            <div>
              <h3 style={{color: '#2F4F4F', fontWeight: '600', fontSize: '1.5rem', marginBottom: '8px'}}>
                Content Management
              </h3>
              <p style={{color: '#2F4F4F', opacity: '0.8', marginBottom: '0', fontSize: '0.95rem'}}>
                Create and manage educational content about biogas, recycling, and sustainability
              </p>
            </div>
          </Col>
          <Col md="4">
            <Button
              style={{
                background: 'linear-gradient(135deg, #25805a, #1e6b47)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '600',
                width: '100%'
              }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <i className="nc-icon nc-simple-add me-2"></i>
              Create New Post
            </Button>
          </Col>
        </Row>

        {/* Posts Table */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3">Loading posts...</p>
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead style={{backgroundColor: '#f8f9fa'}}>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post._id}>
                          <td>
                            <strong>{post.title}</strong>
                            <br />
                            <small className="text-muted">{post.summary.substring(0, 100)}...</small>
                          </td>
                          <td>
                            <Badge bg="secondary">{post.category}</Badge>
                          </td>
                          <td>
                            <Badge bg={post.published ? 'success' : 'warning'}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                            {post.featured && (
                              <Badge bg="info" className="ms-1">Featured</Badge>
                            )}
                          </td>
                          <td>{post.viewCount}</td>
                          <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(post)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(post._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <i className="nc-icon nc-paper-2" style={{fontSize: '3rem', color: '#ccc'}}></i>
                            <p className="mt-2 text-muted">No posts found. Create your first post!</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Create/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton style={{background: '#f8f9fa', borderBottom: '2px solid #25805a'}}>
            <Modal.Title style={{color: '#2F4F4F', fontWeight: '600'}}>
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
              <Row>
                <Col md="8">
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  placeholder="Use # for headings, ## for subheadings, etc."
                />
              </Form.Group>

              <Row>
                <Col md="6">
                  <Form.Group className="mb-3">
                    <Form.Label>Tags (comma-separated)</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="biogas, sustainability, environment"
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <Form.Check
                    type="checkbox"
                    label="Published"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  />
                </Col>
                <Col md="6">
                  <Form.Check
                    type="checkbox"
                    label="Featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer style={{background: '#f8f9fa'}}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #25805a, #1e6b47)',
                  border: 'none'
                }}
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}

export default AdminContentManagement;