import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminContentManagement = () => {
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'getting-started',
    difficulty: 'beginner',
    videoUrl: '',
    thumbnailUrl: '',
    isPublished: true
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/knowledge/articles');
      setArticles(response.data.articles);
    } catch (error) {
      toast.error('Failed to load articles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await axios.put(`/api/knowledge/articles/${editingArticle.id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Article updated!');
      } else {
        await axios.post('/api/knowledge/articles', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Article created!');
      }
      setShowModal(false);
      fetchArticles();
      resetForm();
    } catch (error) {
      toast.error('Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await axios.delete(`/api/knowledge/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Article deleted');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      summary: article.summary,
      category: article.category,
      difficulty: article.difficulty,
      videoUrl: article.videoUrl || '',
      thumbnailUrl: article.thumbnailUrl || '',
      isPublished: article.isPublished
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'getting-started',
      difficulty: 'beginner',
      videoUrl: '',
      thumbnailUrl: '',
      isPublished: true
    });
  };

  const setFeatured = async (articleId, order) => {
    try {
      await axios.post('/api/knowledge/featured', {
        articleId,
        displayOrder: order
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Featured article set!');
    } catch (error) {
      toast.error('Failed to set featured');
    }
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 style={{ color: '#059669', fontWeight: '600' }}> Content Management</h4>
              <p className="text-muted">Manage biogas knowledge articles and videos</p>
            </div>
            <Button
              onClick={() => { resetForm(); setShowModal(true); }}
              style={{ backgroundColor: '#25805a', border: 'none', fontWeight: '600' }}
            >
              + Create Article
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td><strong>{article.title}</strong></td>
                      <td><Badge bg="primary">{article.category}</Badge></td>
                      <td><Badge bg="info">{article.difficulty}</Badge></td>
                      <td>{article.views}</td>
                      <td>
                        <Badge bg={article.isPublished ? 'success' : 'secondary'}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-primary" onClick={() => handleEdit(article)} className="me-2">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(article.id)} className="me-2">
                          Delete
                        </Button>
                        <Button size="sm" variant="outline-success" onClick={() => setFeatured(article.id, 1)}>
                          Feature
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#25805a', color: 'white' }}>
          <Modal.Title>{editingArticle ? 'Edit Article' : 'Create Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="getting-started">Getting Started</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="troubleshooting">Troubleshooting</option>
                    <option value="best-practices">Best Practices</option>
                    <option value="safety">Safety</option>
                    <option value="operations">Operations</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Video URL (YouTube, Vimeo, etc.)</Form.Label>
              <Form.Control
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail URL</Form.Label>
              <Form.Control
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Publish immediately"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="mb-3"
            />

            <div className="d-flex gap-2">
              <Button type="submit" style={{ backgroundColor: '#25805a', border: 'none', fontWeight: '600' }}>
                {editingArticle ? 'Update' : 'Create'} Article
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminContentManagement;
