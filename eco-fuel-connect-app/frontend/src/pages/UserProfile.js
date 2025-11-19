
import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import {
  Badge,
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function UserProfile() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const { user } = useUser();
  // Profile form data state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    phone: '',
    role: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        organization: user.organization || '',
        phone: user.phone || '',
        role: user.role || '',
        bio: user.bio || ''
      });
      const savedProfile = localStorage.getItem(`profilePhoto_${user.id}`);
      const savedCover = localStorage.getItem(`coverPhoto_${user.id}`);
      setProfilePhoto(savedProfile || user.profilePhoto || require("../assets/img/default-avatar.png"));
      setCoverPhoto(savedCover || user.coverPhoto || require("../assets/img/aboutaspageimg.jpg"));
    }
  }, [user]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target.result;
        setProfilePhoto(photoData);
        localStorage.setItem(`profilePhoto_${user.id}`, photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const coverData = e.target.result;
        setCoverPhoto(coverData);
        localStorage.setItem(`coverPhoto_${user.id}`, coverData);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPhotoUpload = () => {
    document.getElementById('photo-upload').click();
  };

  const triggerCoverPhotoUpload = () => {
    document.getElementById('cover-photo-upload').click();
  };
  return (
    <div style={{
      minHeight: '100vh',
      padding: '32px 20px',
      fontFamily: '"Poppins", "Segoe UI", system-ui, sans-serif'
    }}>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card 
              className="shadow-xl border-0"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <Card.Header 
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '24px 24px 0 0',
                  border: 'none',
                  padding: '24px 32px'
                }}
              >
                <Card.Title 
                  as="h4"
                  style={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '24px',
                    fontFamily: '"Poppins", "Segoe UI", sans-serif',
                    marginBottom: '0',
                    letterSpacing: '-0.5px'
                  }}
                >Edit</Card.Title>
              </Card.Header>
              <Card.Body style={{ padding: '32px' }}>
                <Form>
                  <Row>
                    <Col className="pr-3" md="6">
                      <Form.Group className="mb-4">
                        <label 
                          style={{
                            color: '#1f2937',
                            fontWeight: '600',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            marginBottom: '12px',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >First Name</label>
                        <Form.Control
                          value={profileData.firstName}
                          onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          placeholder="First Name"
                          type="text"
                          style={{
                            border: '2px solid transparent',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            fontSize: '16px',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#10b981';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.3)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pl-3" md="6">
                      <Form.Group className="mb-4">
                        <label 
                          style={{
                            color: '#1f2937',
                            fontWeight: '600',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            marginBottom: '12px',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >Last Name</label>
                        <Form.Control
                          value={profileData.lastName}
                          onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          placeholder="Last Name"
                          type="text"
                          style={{
                            border: '2px solid transparent',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            fontSize: '16px',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#10b981';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.3)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group className="mb-4">
                        <label 
                          style={{
                            color: '#1f2937',
                            fontWeight: '600',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            marginBottom: '12px',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >Username</label>
                        <Form.Control
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          placeholder="Username"
                          type="text"
                          style={{
                            border: '2px solid transparent',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            fontSize: '16px',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#10b981';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.3)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group className="mb-4">
                        <label 
                          style={{
                            color: '#1f2937',
                            fontWeight: '600',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            marginBottom: '12px',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >Organization</label>
                        <Form.Control
                          value={profileData.organization}
                          onChange={(e) => handleProfileChange('organization', e.target.value)}
                          placeholder="Organization"
                          type="text"
                          style={{
                            border: '2px solid transparent',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            fontSize: '16px',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#10b981';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.3)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group className="mb-4">
                        <label 
                          style={{
                            color: '#1f2937',
                            fontWeight: '600',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            marginBottom: '12px',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >Location</label>
                        <Form.Control
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          placeholder="Location"
                          type="text"
                          style={{
                            border: '2px solid transparent',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            fontSize: '16px',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#10b981';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.3)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group className="mb-5">
                        <label 
                          style={{
                            color: '#1f2937',
                            fontWeight: '600',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            marginBottom: '12px',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}
                        >About Me</label>
                        <Form.Control
                          as="textarea"
                          rows="5"
                          value={profileData.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          placeholder="Tell something about yourself or your role..."
                          style={{
                            border: '2px solid transparent',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            fontSize: '16px',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            resize: 'vertical',
                            minHeight: '120px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          onFocus={e => {
                            e.target.style.borderColor = '#10b981';
                            e.target.style.backgroundColor = 'white';
                            e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.3)';
                          }}
                          onBlur={e => {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const response = await fetch('/api/users/profile', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify(profileData)
                        });
                        
                        const result = await response.json();
                        
                        if (response.ok && result.success) {
                          // Update localStorage with new user data
                          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                          const updatedUser = { ...currentUser, ...result.user };
                          localStorage.setItem('user', JSON.stringify(updatedUser));
                          
                          alert('✓ Profile updated successfully!');
                          
                          // Reload page to reflect changes
                          setTimeout(() => window.location.reload(), 1000);
                        } else {
                          alert('Failed to update profile: ' + (result.message || result.error || 'Unknown error'));
                        }
                      } catch (error) {
                        console.error('Profile update error:', error);
                        alert('Error updating profile: ' + error.message);
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      padding: '16px 40px',
                      fontWeight: '600',
                      fontFamily: '"Poppins", "Segoe UI", sans-serif',
                      borderRadius: '16px',
                      fontSize: '16px',
                      color: 'white',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 20px 40px -10px rgba(16, 185, 129, 0.5)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.4)';
                    }}
                  >
                    Update Profile
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card 
              className="card-user shadow-lg border-0"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.2)'
              }}
            >
              <div 
                className="card-image" 
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <img
                  alt="Cover Photo"
                  src={coverPhoto}
                  style={{
                    borderRadius: '24px 24px 0 0',
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: 'brightness(0.9)'
                  }}
                  onClick={triggerCoverPhotoUpload}
                  onMouseEnter={e => {
                    e.target.style.filter = 'brightness(0.7)';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.filter = 'brightness(0.9)';
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <div 
                  onClick={triggerCoverPhotoUpload}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: '"Poppins", "Segoe UI", sans-serif',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(37, 128, 90, 0.8)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Change Cover
                </div>
                <input
                  id="cover-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
              <Card.Body>
                <div className="author text-center">
                  <div style={{ display: 'inline-block', position: 'relative' }}>
                    <img
                      alt="User Avatar"
                      className="avatar"
                      src={profilePhoto}
                      style={{
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        border: '5px solid transparent',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        backgroundClip: 'padding-box',
                        boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'block',
                        padding: '5px'
                      }}
                      onClick={triggerPhotoUpload}
                      onMouseEnter={e => {
                        e.target.style.boxShadow = '0 25px 50px -10px rgba(16, 185, 129, 0.6)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.boxShadow = '0 20px 40px -10px rgba(16, 185, 129, 0.4)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <p 
                    onClick={triggerPhotoUpload}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '12px',
                      marginBottom: '20px',
                      fontFamily: '"Poppins", "Segoe UI", sans-serif',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Change Photo
                  </p>
                  <h5 
                    className="title"
                    style={{
                      background: 'linear-gradient(135deg, #1f2937 0%, #10b981 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: '700',
                      fontFamily: '"Poppins", "Segoe UI", sans-serif',
                      fontSize: '1.5rem',
                      marginTop: '8px',
                      letterSpacing: '0.5px'
                    }}
                  >{profileData.firstName} {profileData.lastName}</h5>
                  <p 
                    className="description"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: '600',
                      fontFamily: '"Poppins", "Segoe UI", sans-serif',
                    }}
                  >{profileData.bio}</p>
                </div>
                <p 
                  className="description text-center"
                  style={{
                    color: '#64748b',
                    fontFamily: '"Poppins", "Segoe UI", sans-serif',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                    opacity: '0.9',
                    fontWeight: '400',
                    letterSpacing: '0.3px'
                  }}
                >
                  "Leading sustainable biogas innovation through technology and community collaboration in South Sudan."
                </p>
              </Card.Body>
              <hr style={{borderColor: 'rgba(16, 185, 129, 0.2)', margin: '25px 0'}} />
              <div className="button-container mr-auto ml-auto text-center">
                <Button
                  className="btn-simple btn-icon"
                  href="#!"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '1.6rem',
                    margin: '0 12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: 'none'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-3px) scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <i className="fab fa-facebook-square"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#!"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '1.6rem',
                    margin: '0 12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: 'none'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-3px) scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#!"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '1.6rem',
                    margin: '0 12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: 'none'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-3px) scale(1.1)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <i className="fab fa-linkedin"></i>
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserProfile;
