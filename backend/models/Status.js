import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    status: { type: String, required: true },  // login, logout, active, inactive
    timestamp: { type: Date, default: Date.now },
    location: { type: String },
    ip: { type: String },
    device: { type: String }
});

const Status = mongoose.model("Status", statusSchema);
export default Status;
