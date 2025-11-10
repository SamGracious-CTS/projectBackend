// const request = require('supertest');
// const app = require('../app');
// const { expect } = require('chai');

// const validAppointment = {
//   patientId: 104,
//   date: '2025-10-20',
//   startTime: '05:00',
//   endTime: '06:00'
// };

// const invalidDateFormat = {
//   patientId: 110,
//   date: '25-10-2025',
//   startTime: '10:00',
//   endTime: '10:30'
// };

// describe('Appointment Booking', () => {
//   it('should book an appointment with valid data', (done) => {
//     request(app)
//       .post('/appointments/Psychiatry/1/appointment')
//       .send(validAppointment)
//       .expect(201)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.body).to.have.property('appointment');
//         expect(res.body.appointment).to.have.property('appointmentId');
//         expect(res.body.appointment.status).to.equal('confirmed');
//         done();
//       });
//   });

//   it('should reject booking with invalid date format', (done) => {
//     request(app)
//       .post('/appointments/Psychiatry/1/appointment')
//       .send(invalidDateFormat)
//       .expect(400)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.body).to.have.property('errors');
//         done();
//       });
//   });
// });


const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const data = require('../test/appointmentTestData');

describe('Appointment Booking', () => {
  it('should book an appointment with valid data', (done) => {
    request(app)
      .post('/appointments/Psychiatry/1/appointment')
      .send(data.validAppointment)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('appointment');
        expect(res.body.appointment.status).to.equal('confirmed');
        done();
      });
  });

  it('should reject booking with invalid date format', (done) => {
    request(app)
      .post('/appointments/Psychiatry/1/appointment')
      .send(data.invalidDateFormat)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('errors');
        done();
      });
  });

  it('should reject booking with invalid time format', (done) => {
    request(app)
      .post('/appointments/Psychiatry/1/appointment')
      .send(data.invalidTimeFormat)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('errors');
        done();
      });
  });

  it('should reject booking when endTime is before startTime', (done) => {
    request(app)
      .post('/appointments/Psychiatry/1/appointment')
      .send(data.endTimeBeforeStartTime)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('errors');
        done();
      });
  });

  it('should reject booking when required fields are missing', (done) => {
    request(app)
      .post('/appointments/Psychiatry/1/appointment')
      .send(data.missingFields)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('errors');
        done();
      });
  });

  it('should reject booking if the slot is already booked by another appointment', (done) => {
    request(app)
      .post('/appointments/Psychiatry/1/appointment')
      .send(data.slotAlreadyBooked)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Requested slot is already booked');
        done();
      });
  });

  it('should reject booking if patient already has an appointment at the same time', (done) => {
    request(app)
      .post('/appointments/Dermatology/2/appointment')
      .send(data.patientConflict)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Patient already has an appointment at this time');
        done();
      });
  });
});
