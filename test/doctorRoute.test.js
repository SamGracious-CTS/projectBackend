const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const data = require('./data/doctorDummyData');

describe('Doctor Time Slot Management', () => {
  it('should add valid time slots for a doctor', (done) => {
    request(app)
      .put('/doctor/timeSlots')
      .send(data.validDoctor)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Time slots added successfully');
        done();
      });
  });

  it('should reject slot where endTime is before startTime', (done) => {
    request(app)
      .put('/doctor/timeSlots')
      .send(data.invalidSlotTime)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors).to.be.an('array');
        done();
      });
  });

  it('should reject slot with missing fields', (done) => {
    request(app)
      .put('/doctor/timeSlots')
      .send(data.missingSlotFields)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors).to.be.an('array');
        done();
      });
  });

  it('should edit an existing slot', (done) => {
    request(app)
      .put('/doctor/editSlots')
      .send(data.editSlotPayload)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Slot updated successfully');
        done();
      });
  });

  it('should delete a time slot', (done) => {
    request(app)
      .put('/doctor/deleteSlot')
      .send(data.deleteSlotPayload)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Slot deleted successfully');
        done();
      });
  });

  it('should fetch available slots', (done) => {
    request(app)
      .get('/doctor/getSlots')
      .query({ registrationNumber: 'DOC123', date: '2025-11-15' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.slots).to.be.an('array');
        done();
      });
  });
});
