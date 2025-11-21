import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Form, Button, Alert, Table, Badge, Modal } from "react-bootstrap";
import api from "../services/api";

function ContentManagement() {
  const [activeTab, setActiveTab] = useState("create");
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    featured: false
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ["Biogas Basics", "Waste Management", "Environment & Health", "Community Impact", "Innovation", "Getting Started"];

  useEffect(() => {
    fetchPosts().catch(err => {
      console.error('Failed to load posts:', err);
      setPosts([]);
    });
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/content');
      const postsData = response?.data?.posts;
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category) {
      setAlertMessage("Please fill in all required fields");
      setAlertType("danger");
      setShowAlert(true);
      return;
    }

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: { name: "Admin" },
        viewCount: 0,
        summary: formData.content.substring(0, 150) + "..."
      };

      const response = await api.post('/content', postData);
      setPosts(prev => [response.data, ...prev]);
      setFormData({ title: "", content: "", category: "", tags: "", featured: false });
      setAlertMessage("Post created successfully!");
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setAlertMessage("Failed to create post. Please try again.");
      setAlertType("danger");
      setShowAlert(true);
    }
  };

  const viewPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="content">
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header className="text-center">
                <Card.Title as="h4">Content Management</Card.Title>
                <p className="card-category">Create and manage educational content</p>
              </Card.Header>
            </Card>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant={alertType} className="mb-4" dismissible onClose={() => setShowAlert(false)}>
            {alertMessage}
          </Alert>
        )}

        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex gap-2 mb-3">
                    <Button
                      onClick={() => setActiveTab("create")}
                      style={{
                        backgroundColor: activeTab === "create" ? "#28a745" : "#f8f9fa",
                        borderColor: activeTab === "create" ? "#28a745" : "#dee2e6",
                        color: activeTab === "create" ? "white" : "#495057",
                        borderRadius: "20px",
                        padding: "8px 16px",
                        border: "1px solid"
                      }}
                    >
                      Create Post
                    </Button>
                    <Button
                      onClick={() => setActiveTab("manage")}
                      style={{
                        backgroundColor: activeTab === "manage" ? "#28a745" : "#f8f9fa",
                        borderColor: activeTab === "manage" ? "#28a745" : "#dee2e6",
                        color: activeTab === "manage" ? "white" : "#495057",
                        borderRadius: "20px",
                        padding: "8px 16px",
                        border: "1px solid"
                      }}
                    >
                      Manage Posts
                    </Button>
                  </div>
                </div>

                {activeTab === "create" && (
                  <Row>
                    <Col md="8">
                      <Card>
                        <Card.Header><Card.Title as="h5">Create New Post</Card.Title></Card.Header>
                        <Card.Body>
                          <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                              <Form.Label>Title *</Form.Label>
                              <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter post title"
                                required
                              />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                              <Form.Label>Category *</Form.Label>
                              <Form.Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Content *</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={8}
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="Write your post content here..."
                                required
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Tags</Form.Label>
                              <Form.Control
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="Enter tags separated by commas"
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Check
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleInputChange}
                                label="Featured Post"
                              />
                            </Form.Group>

                            <Button
                              type="submit"
                              style={{
                                backgroundColor: "#28a745",
                                borderColor: "#28a745",
                                color: "white",
                                borderRadius: "20px",
                                padding: "8px 24px"
                              }}
                            >
                              Publish Post
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card>
                        <Card.Header><Card.Title as="h5">Quick Stats</Card.Title></Card.Header>
                        <Card.Body>
                          <div className="text-center">
                            <h4 className="text-primary">{posts.length}</h4>
                            <small>Total Posts</small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}

                {activeTab === "manage" && (
                  <div>
                    {posts.length > 0 ? (
                      <Table responsive striped hover>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Views</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map(post => (
                            <tr key={post._id || post.id}>
                              <td>{post.title}</td>
                              <td>{post.category}</td>
                              <td>{post.viewCount || 0}</td>
                              <td>
                                <Badge bg={post.featured ? 'warning' : 'success'}>
                                  {post.featured ? 'Featured' : 'Published'}
                                </Badge>
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => viewPost(post)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-5">
                        <h5>No posts found</h5>
                        <p>Create your first post to get started!</p>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Post View Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedPost?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPost && (
              <>
                <Badge bg="primary" className="mb-3">{selectedPost.category}</Badge>
                <div style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</div>
                {selectedPost.tags && (
                  <div className="mt-3">
                    <strong>Tags: </strong>
                    {selectedPost.tags.map(tag => (
                      <Badge key={tag} bg="light" text="dark" className="me-1">{tag}</Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default ContentManagement;