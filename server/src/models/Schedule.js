const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  dateTimePicker: {
    type: Date,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
    minlength: 6,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 11,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;