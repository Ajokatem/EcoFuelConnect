import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';

const SupplierRewards = () => {
  const { translate } = useLanguage();
  const [coins, setCoins] = useState({ total: 0, lifetime: 0, cashValue: '0.00' });
  const [earnings, setEarnings] = useState({ totalEarnings: 0, paidAmount: 0, pendingAmount: 0 });
  const [payments, setPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  useEffect(() => {
    fetchRewards();
    const interval = setInterval(fetchRewards, 5000); // Poll every 5 seconds for real-time updates
    return () => clearInterval(interval);
  }, []);

  const fetchRewards = async () => {
    try {
      const { data } = await api.get('/rewards/my-rewards');
      if (data.success) {
        setCoins(data.coins || { total: 0, lifetime: 0, cashValue: '0.00' });
        setEarnings(data.earnings || { totalEarnings: 0, paidAmount: 0, pendingAmount: 0 });
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to load rewards:', error);
    }
  };

  const handleRequestPayment = async () => {
    if (selectedPayments.length === 0) {
      toast.warning('Select payments to request');
      return;
    }

    try {
      await api.post('/rewards/request-payment', {
        paymentIds: selectedPayments,
        paymentMethod
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
          <h4 style={{ color: '#059669', fontWeight: '600' }}>{translate('myRewards')}</h4>
          <p className="text-muted">{translate('trackEarnings')}</p>
        </Col>
      </Row>

      {/* Coin Balance Card */}
      <Row className="mb-4">
        <Col>
          <Card style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: '#fff',
            borderRadius: '16px',
            border: 'none'
          }}>
            <Card.Body className="p-4">
              <Row>
                <Col md={4} className="text-center">
                  <h2 style={{ fontSize: '3rem', fontWeight: '700', margin: 0 }}>{coins.total}</h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>{translate('availableCoins')}</p>
                </Col>
                <Col md={4} className="text-center">
                  <h2 style={{ fontSize: '3rem', fontWeight: '700', margin: 0 }}>${coins.cashValue}</h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>{translate('cashValue')}</p>
                </Col>
                <Col md={4} className="text-center">
                  <h2 style={{ fontSize: '3rem', fontWeight: '700', margin: 0 }}>{coins.lifetime}</h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>{translate('lifetimeEarned')}</p>
                </Col>
              </Row>
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.3)', textAlign: 'center' }}>
                <small style={{ fontSize: '0.9rem' }}>{translate('earnCoins')} • {translate('conversionRate')} • {translate('updatesEvery')}</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <h6 className="text-muted">{translate('totalEarnings')}</h6>
              <h3 style={{ color: '#059669' }}>{earnings.totalEarnings.toFixed(2)} SSP</h3>
              <small className="text-success">{translate('allTime')}</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <h6 className="text-muted">{translate('paidAmount')}</h6>
              <h3 style={{ color: '#10b981' }}>{earnings.paidAmount.toFixed(2)} SSP</h3>
              <small className="text-success">{translate('completed')}</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <h6 className="text-muted">{translate('pendingPayment')}</h6>
              <h3 style={{ color: '#f59e0b' }}>{earnings.pendingAmount.toFixed(2)} SSP</h3>
              <small className="text-warning">{translate('awaitingApproval')}</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{translate('transactionHistory')}</h5>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '200px' }}
                  >
                    <option value="mobile_money">{translate('mobileMoney')}</option>
                    <option value="cash">{translate('cash')}</option>
                    <option value="biogas_credit">{translate('biogasCredit')}</option>
                  </Form.Select>
                  <Button
                    onClick={handleRequestPayment}
                    disabled={selectedPayments.length === 0}
                    style={{ backgroundColor: '#25805a', border: 'none', fontWeight: '600' }}
                  >
                    {translate('requestPayment')} ({selectedPayments.length})
                  </Button>
                </div>
              </div>

              <Table hover responsive>
                <thead>
                  <tr>
                    <th>{translate('date')}</th>
                    <th>{translate('wasteType')}</th>
                    <th>{translate('quantity')} ({translate('kg')})</th>
                    <th>{translate('coinsEarned')}</th>
                    <th>{translate('cashValue')}</th>
                    <th>{translate('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div style={{ fontSize: '1.2rem', color: '#888' }}>
                          {translate('noEarningsYet')}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.wasteDate).toLocaleDateString()}</td>
                        <td>
                          <span style={{ textTransform: 'capitalize' }}>
                            {payment.wasteType?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td><strong>{payment.quantitySupplied} kg</strong></td>
                        <td>
                          <Badge bg="success" style={{ fontSize: '1rem', padding: '8px 12px' }}>
                            +{payment.coinsEarned || Math.abs(payment.totalAmount * 100)} coins
                          </Badge>
                        </td>
                        <td><strong>${payment.totalAmount.toFixed(2)}</strong></td>
                        <td>
                          <Badge bg="success">{translate('earned')}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
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
