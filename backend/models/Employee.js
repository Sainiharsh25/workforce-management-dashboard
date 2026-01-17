// models/Employee.js
import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  gender: String,
  profilePhoto: String,
  job: String,
  age: Number,
  salary: Number,
  status: String,
  location: String,
  activeTimeToday: Number,
  performance: {
    totalTasks: Number,
    completedTasks: Number,
    onTimeTasks: Number,
  },
}, { timestamps: true });

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
