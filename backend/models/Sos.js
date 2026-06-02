// In-memory mock DB to bypass PROTOCOL_CONNECTION_LOST on Railway
let sosEvents = [
  { id: 501, nanny_id: 1, nanny: 'Maria Mim', category: 'Medical Emergency', location: 'Lat 23.79, Lng 90.41', time: '2 mins ago', status: 'Unresolved', message: 'Need an ambulance' },
  { id: 502, nanny_id: 2, nanny: 'Samanta Khan', category: 'Unsafe Environment', location: 'Lat 23.81, Lng 90.42', time: '5 mins ago', status: 'Investigating', message: 'I feel unsafe' }
];

let idCounter = 503;

const sendSos = async ({ nanny_id, lat, lng, message }) => {
  const id = idCounter++;
  const newSos = {
    id,
    nanny_id,
    nanny: 'Unknown Nanny (ID: ' + nanny_id + ')',
    category: 'Emergency',
    location: (lat && lng) ? `Lat ${lat}, Lng ${lng}` : 'Unknown Location',
    time: 'Just now',
    status: 'Unresolved',
    message: message || 'SOS Triggered'
  };
  sosEvents.push(newSos);
  return { id };
};

const findAll = async () => sosEvents.filter(s => s.status !== 'Resolved');

const resolveSos = async (id, status) => {
  const sos = sosEvents.find(s => s.id == id);
  if (sos) sos.status = status;
};

module.exports = { sendSos, findAll, resolveSos };
