import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupplierRewards = () => {
  const [earnings, setEarnings] = useState({ totalEarnings: 0, paidAmount: 0, pendingAmount: 0 });
  const [payments, setPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`/api/rewards/supplier/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEarnings(response.data.earnings);
      setPayments(response.data.payments);
    } catch (error) {
      toast.error('Failed to load rewards');
    }
  };

  const handleRequestPayment = async () => {
    if (selectedPayments.length === 0) {
      toast.warning('Select payments to request');
      return;
    }

    try {
      await axios.post('/api/rewards/request-payment', {
        paymentIds: selectedPayments,
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Payment request submitted!');
      fetchRewards();
      setSelectedPayments([]);
    } catch (error) {
      toast.error('Failed to request payment');
    }
  };

  const togglePayment = (id) => {
    setSelectedPayments(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col>
          <h4 style={{ color: '#059669', fontWeight: '600' }}> My Rewards & Earnings</h4>
          <p className="text-muted">Track your waste supply earnings</p>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <h6 className="text-muted">Total Earnings</h6>
              <h3 style={{ color: '#059669' }}>{earnings.totalEarnings.toFixed(2)} SSP</h3>
              <small className="text-success">All time</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <h6 className="text-muted">Paid Amount</h6>
              <h3 style={{ color: '#10b981' }}>{earnings.paidAmount.toFixed(2)} SSP</h3>
              <small className="text-success">Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <h6 className="text-muted">Pending Payment</h6>
              <h3 style={{ color: '#f59e0b' }}>{earnings.pendingAmount.toFixed(2)} SSP</h3>
              <small className="text-warning">Awaiting approval</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Payment History</h5>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="mobile_money">Mobile Money</option>
                    <option value="cash">Cash</option>
                    <option value="biogas_credit">Biogas Credit</option>
                  </Form.Select>
                  <Button
                    onClick={handleRequestPayment}
                    disabled={selectedPayments.length === 0}
                    style={{ backgroundColor: '#25805a', border: 'none', fontWeight: '600' }}
                  >
                    Request Payment ({selectedPayments.length})
                  </Button>
                </div>
              </div>

              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Date</th>
                    <th>Waste Type</th>
                    <th>Quantity (kg)</th>
                    <th>Rate (SSP/kg)</th>
                    <th>Amount (SSP)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        {payment.paymentStatus === 'pending' && (
                          <Form.Check
                            checked={selectedPayments.includes(payment.id)}
                            onChange={() => togglePayment(payment.id)}
                          />
                        )}
                      </td>
                      <td>{new Date(payment.wasteDate).toLocaleDateString()}</td>
                      <td>{payment.wasteType?.replace('_', ' ')}</td>
                      <td>{payment.quantitySupplied}</td>
                      <td>{payment.paymentRate}</td>
                      <td><strong>{payment.totalAmount.toFixed(2)}</strong></td>
                      <td>
                        <Badge bg={
                          payment.paymentStatus === 'completed' ? 'success' :
                          payment.paymentStatus === 'approved' ? 'info' :
                          payment.paymentStatus === 'pending' ? 'warning' : 'secondary'
                        }>
                          {payment.paymentStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SupplierRewards;
