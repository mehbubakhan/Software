// In-memory mock DB to bypass PROTOCOL_CONNECTION_LOST on Railway
let pendingVerifications = [
  { id: 101, name: 'Kamrun Nahar', type: 'Nanny', docs: ['NID', 'Police Clearance', 'Selfie'], status: 'Pending' },
  { id: 102, name: 'Caring Hearts Agency', type: 'Organization', docs: ['Trade License', 'Owner NID'], status: 'Pending' },
  { id: 103, name: 'Deedhity Dhara', type: 'Nanny', docs: ['NID', 'Medical', 'Selfie'], status: 'Pending' }
];

const getPendingVerifications = async (req, res) => {
  try {
    const data = pendingVerifications.filter(v => v.status === 'Pending');
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const item = pendingVerifications.find(v => v.id == id);
    if (item) {
      item.status = status;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

module.exports = { getPendingVerifications, updateVerificationStatus };
