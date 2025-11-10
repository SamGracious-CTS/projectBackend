module.exports = {
  validDoctor: {
    registrationNumber: 'DOC123',
    name: 'Dr. John Smith',
    email: 'johnsmith@doctor.com',
    specialty: 'Cardiology',
    registrationValidUpto: '2026-12-31',
    calendar: [
      {
        date: '2025-11-15',
        availableSlots: [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '10:30', endTime: '11:30' }
        ]
      }
    ]
  },

  invalidSlotTime: {
    registrationNumber: 'DOC123',
    calendar: [
      {
        date: '2025-11-15',
        availableSlots: [
          { startTime: '11:00', endTime: '10:00' } // endTime < startTime
        ]
      }
    ]
  },

  missingSlotFields: {
    registrationNumber: 'DOC123',
    calendar: [
      {
        date: '2025-11-15',
        availableSlots: [
          { startTime: '09:00' } // missing endTime
        ]
      }
    ]
  },

  editSlotPayload: {
    registrationNumber: 'DOC123',
    date: '2025-11-15',
    oldSlot: { startTime: '09:00', endTime: '10:00' },
    newSlot: { startTime: '09:30', endTime: '10:30' }
  },

  deleteSlotPayload: {
    registrationNumber: 'DOC123',
    date: '2025-11-15',
    slot: { startTime: '10:30', endTime: '11:30' }
  }
};
