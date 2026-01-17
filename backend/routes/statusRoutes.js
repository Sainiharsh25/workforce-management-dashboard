import express from 'express';
import Status from '../models/statusModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Received status update:', req.body);

  try {
    const { employeeId, status, timestamp, location, ip, device } = req.body;

    if (!employeeId || !status || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newStatus = new Status({
      employeeId,
      status,
      timestamp,
      location,
      ip,
      device
    });

    await newStatus.save();
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error saving status:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
