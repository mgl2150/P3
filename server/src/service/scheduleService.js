const Schedule = require("../models/Schedule");
const { handleError } = require("../utils");

const scheduleService = {
  createSchedule: async (req, res) => {
    const {dateTimePicker, fullname, phoneNumber} = req.body
    try {
      // Check if there are already two schedules with the requested time
      const existingSchedules = await Schedule.find({
        dateTimePicker,
      });

      if (existingSchedules.length >= 2) {
        return res
          .status(400)
          .json({ message: 'Maximum two schedules already exist at this time' });
      }

      const newSchedule = new Schedule({
        dateTimePicker,
        fullname,
        phoneNumber,
      });

      // Save the new schedule to the database
      const savedSchedule = await newSchedule.save();

      res.status(200).json(savedSchedule);
    } catch (error) {
        console.log(error.message);
      handleError(error, res, "Failed to create schedule");
    }
  },

  getAllSchedules: async (req, res) => {
    try {
      const schedules = await Schedule.find();
    res.status(200).json(schedules)
    } catch (error) {
      handleError(error, res, "Failed to fetch schedules");
    }
  },
  updateSchedule: async (req, res) => {
    const scheduleId  = req.params.id;
    const { dateTimePicker, fullname, phoneNumber } = req.body;
    try {
      const existingSchedules = await Schedule.find({
        dateTimePicker,
      });
      const existingSchedule = await Schedule.findById(scheduleId);

      if (!existingSchedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      if (existingSchedules.length >= 2) {
        return res
          .status(400)
          .json({ message: 'Maximum two schedules already exist at this time' });
      }

      existingSchedule.dateTimePicker = dateTimePicker;
      existingSchedule.fullname = fullname;
      existingSchedule.phoneNumber = phoneNumber;

      const updatedSchedule = await existingSchedule.save();
      res.status(200).json(updatedSchedule);
    } catch (error) {
      handleError(error, res, 'Failed to update schedule');
    }
  },
  deleteSchedule: async (req, res) => {
    const scheduleId = req.params.id
    try {
      const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId)
      if (!deletedSchedule) {
        return res.status(404).json({ message: 'Schedule not found' })
      }
      res.json({ message: 'Schedule deleted successfully' })
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete schedule' })
    }
  },

};

module.exports = scheduleService;
