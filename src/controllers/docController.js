const Doctor = require("../models/doctorsSchema");
const { validationResult } = require("express-validator");

// GET /doctors?specialty=Cardiology&id=123
const getFilteredDoctors = async (req, res) => {
  try {
    const { specialty, registrationNumber } = req.query;

    let query = {};

    // Build query dynamically
    if (specialty) {
      query.specialty = specialty;
    }
    if (registrationNumber) {
      query.registrationNumber = registrationNumber;
    }

    // If neither is provided → return all doctors
    const doctors = await Doctor.find(Object.keys(query).length ? query : {});

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// PUT /doctors/:id
const updateDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { name, specialty } = req.body;
    if (name) doctor.name = name;
    if (specialty) doctor.specialty = specialty;

    await doctor.save();
    res.json({ message: "Doctor updated successfully", doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update doctor" });
  }
};

const timeSlots = async (req, res) => {
  try {
    const registrationNumber = req.query.registrationNumber; // ✅ Use registrationNumber
    const action = req.query.action;
    const { calendar } = req.body;

    if (!Array.isArray(calendar)) {
      return res.status(400).json({ message: "Calendar must be an array" });
    }

    for (const entry of calendar) {
      const { date, availableSlots } = entry;

      if (action === "delete") {
        for (const slot of availableSlots) {
          await Doctor.updateOne(
            { registrationNumber: registrationNumber, "calendar.date": date }, // ✅ Changed here
            {
              $pull: {
                "calendar.$.availableSlots": {
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                },
              },
            }
          );
        }
      } else if (action === "add") {
        const existingDate = await Doctor.findOne({
          registrationNumber: registrationNumber, // ✅ Changed here
          "calendar.date": date,
        });

        if (!existingDate) {
          await Doctor.updateOne(
            { registrationNumber: registrationNumber }, // ✅ Changed here
            {
              $push: {
                calendar: {
                  date: date,
                  availableSlots: availableSlots,
                },
              },
            }
          );
        } else {
          for (const slot of availableSlots) {
            await Doctor.updateOne(
              { registrationNumber: registrationNumber, "calendar.date": date }, // ✅ Changed here
              {
                $addToSet: { "calendar.$.availableSlots": slot }, // ✅ Prevent duplicates
              }
            );
          }
        }
      }
    }

    return res.status(200).json({
      message: action === "delete" ? "Slots deleted successfully" : "Slots added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const editSlots = async (req, res) => {
  try {
    const { registrationNumber } = req.query;
    const { previousSlot, newSlot } = req.body;

    if (!registrationNumber || !previousSlot || !newSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Remove previous slot from its date
    await Doctor.updateOne(
      { registrationNumber, "calendar.date": previousSlot.date },
      { $pull: { "calendar.$.availableSlots": { startTime: previousSlot.startTime, endTime: previousSlot.endTime } } }
    );

    if (previousSlot.date === newSlot.date) {
      // Same date: just add new time slot
      await Doctor.updateOne(
        { registrationNumber, "calendar.date": newSlot.date },
        { $addToSet: { "calendar.$.availableSlots": { startTime: newSlot.startTime, endTime: newSlot.endTime } } }
      );
    } else {
      // Date changed: check if new date exists
      const existingDate = await Doctor.findOne({
        registrationNumber,
        "calendar.date": newSlot.date
      });

      if (existingDate) {
        // Add new slot to existing date
        await Doctor.updateOne(
          { registrationNumber, "calendar.date": newSlot.date },
          { $addToSet: { "calendar.$.availableSlots": { startTime: newSlot.startTime, endTime: newSlot.endTime } } }
        );
      } else {
        // Create new date with slot
        await Doctor.updateOne(
          { registrationNumber },
          {
            $push: {
              calendar: {
                date: newSlot.date,
                availableSlots: [{ startTime: newSlot.startTime, endTime: newSlot.endTime }]
              }
            }
          }
        );
      }
    }

    return res.status(200).json({ message: "Slot updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const deleteTimeSlot = async (req, res) => {
  try {
    const { registrationNumber } = req.query;
    const { date, startTime, endTime } = req.body;

    if (!registrationNumber || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await Doctor.updateOne(
      { registrationNumber, "calendar.date": new Date(date) },
      {
        $pull: {
          "calendar.$.availableSlots": { startTime, endTime }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: `No matching slot found on ${date}` });
    }

    return res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const getTimeSlot = async (req, res) => {
  try {
    const { registrationNumber } = req.query; // ✅ Get registrationNumber from query params

    if (!registrationNumber) {
      return res.status(400).json({ message: "registrationNumber is required" });
    }

    // Find doctor by registrationNumber
    const doctor = await Doctor.findOne({ registrationNumber }).select("calendar name specialty");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Flatten all available slots into a single array
    const slots = doctor.calendar.flatMap(entry =>
      entry.availableSlots.map(slot => ({
        date: entry.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.isBooked
      }))
    );

    return res.status(200).json({ slots });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getFilteredDoctors,
  updateDoctor,
  timeSlots,
  deleteTimeSlot,
  getTimeSlot,
  editSlots
};
