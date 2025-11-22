import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';

function CoinRewards() {
  const { user } = useUser();
  const [coins, setCoins] = useState({ total: 0, lifetime: 0, cashValue: '0.00' });
  const [transactions, setTransactions] = useState([]);
  const [showConvert, setShowConvert] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const { data } = await api.get('/rewards/coins');
      if (data.success) {
        setCoins(data.coins);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  const handleConvert = async () => {
    if (!convertAmount || convertAmount < 100) {
      setMessage('Minimum 100 coins required');
      return;
    }

    try {
      const { data } = await api.post('/rewards/coins/convert', {
        amount: parseInt(convertAmount),
        paymentMethod
      });
      
      if (data.success) {
        setMessage(`✅ Successfully converted ${convertAmount} coins to $${data.conversion.cash}!`);
        setShowConvert(false);
        setConvertAmount('');
        fetchCoins();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error converting coins');
    }
  };

  return (
    <div>
      {message && <Alert variant={message.includes('✅') ? 'success' : 'danger'} onClose={() => setMessage('')} dismissible>{message}</Alert>}
      
      <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', marginBottom: 20 }}>
        <Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 48, fontWeight: 700, margin: 0 }}>🪙 {coins.total}</h2>
              <p style={{ margin: 0, opacity: 0.9 }}>Total Coins</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: 32, fontWeight: 600, margin: 0 }}>${coins.cashValue}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Cash Value</p>
            </div>
          </div>
          <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
            <small>Lifetime Earned: {coins.lifetime} coins</small>
          </div>
        </Card.Body>
      </Card>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <Button variant="success" onClick={() => setShowConvert(true)} disabled={coins.total < 100} style={{ flex: 1 }}>
          💰 Convert to Cash
        </Button>
        <Button variant="outline-primary" onClick={fetchCoins} style={{ flex: 1 }}>
          🔄 Refresh
        </Button>
      </div>

      <Card>
        <Card.Header><strong>Recent Transactions</strong></Card.Header>
        <ListGroup variant="flush">
          {transactions.length === 0 ? (
            <ListGroup.Item>No transactions yet. Start logging waste to earn coins!</ListGroup.Item>
          ) : (
            transactions.map((tx, idx) => (
              <ListGroup.Item key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {tx.type === 'earned' && '🎉'} 
                    {tx.type === 'converted' && '💸'} 
                    {tx.type === 'bonus' && '🎁'} 
                    {tx.description}
                  </div>
                  <small style={{ color: '#888' }}>{new Date(tx.createdAt).toLocaleString()}</small>
                </div>
                <Badge bg={tx.amount > 0 ? 'success' : 'danger'} style={{ fontSize: 16 }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </Badge>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>

      <Modal show={showConvert} onHide={() => setShowConvert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>💰 Convert Coins to Cash</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Conversion Rate:</strong> 100 coins = $1.00<br/>
            <strong>Minimum:</strong> 100 coins<br/>
            <strong>Processing Time:</strong> 3-5 business days
          </Alert>
          
          <Form.Group className="mb-3">
            <Form.Label>Amount (coins)</Form.Label>
            <Form.Control 
              type="number" 
              value={convertAmount} 
              onChange={(e) => setConvertAmount(e.target.value)}
              min="100"
              max={coins.total}
              placeholder="Enter amount"
            />
            <Form.Text>You will receive: ${(convertAmount * 0.01).toFixed(2)}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="paypal">PayPal</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConvert(false)}>Cancel</Button>
          <Button variant="success" onClick={handleConvert}>Convert Now</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CoinRewards;
