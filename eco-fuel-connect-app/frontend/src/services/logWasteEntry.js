// Example: Log waste entry using fetch (frontend JS)

async function logWasteEntry(token, wasteData) {
  const response = await fetch('/api/waste-logging', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(wasteData)
  });
  return response.json();
}

// Usage example:
// const token = 'YOUR_JWT_TOKEN';
// const wasteData = {
//   producerId: 2,
//   wasteType: 'kitchen_scraps',
//   wasteSource: 'restaurant',
//   quantity: 10,
//   unit: 'kg',
//   qualityGrade: 'good',
//   verificationMethod: 'manual_estimate'
// };
// logWasteEntry(token, wasteData).then(console.log);
