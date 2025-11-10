// tests/data/appointmentDummyData.js

module.exports = {
  validPatientId: '653f1a2b9c1e4a0012a3b456',
  validRegistrationNumber: 'DOC123',

  validAppointment: {
    patientId: '653f1a2b9c1e4a0012a3b456',
    registrationNumber: 'DOC123',
    date: '2025-10-20',
    startTime: '05:00',
    endTime: '06:00'
  },

  invalidDateFormat: {
    patientId: '653f1a2b9c1e4a0012a3b456',
    registrationNumber: 'DOC123',
    date: '20-10-2025',
    startTime: '10:00',
    endTime: '10:30'
  },

  invalidTimeFormat: {
    patientId: '653f1a2b9c1e4a0012a3b456',
    registrationNumber: 'DOC123',
    date: '2025-10-20',
    startTime: '25:00',
    endTime: '26:00'
  },

  endTimeBeforeStartTime: {
    patientId: '653f1a2b9c1e4a0012a3b456',
    registrationNumber: 'DOC123',
    date: '2025-10-20',
    startTime: '10:00',
    endTime: '09:30'
  },

  missingFields: {
    patientId: '653f1a2b9c1e4a0012a3b456',
    date: '2025-10-20'
  },

  slotAlreadyBooked: {
    patientId: '653f1a2b9c1e4a0012a3b456',
    registrationNumber: 'DOC123',
    date: '2025-10-20',
    startTime: '05:00',
    endTime: '06:00'
  },

  patientConflict: {
    patientId: '653f1a2b9c1e4a0012a3b456',
    registrationNumber: 'DOC456',
    date: '2025-10-20',
    startTime: '05:00',
    endTime: '06:00'
  }
};
