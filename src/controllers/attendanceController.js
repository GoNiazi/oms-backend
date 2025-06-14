import Attendance from '../models/Attendance.js';
import moment from 'moment';

export const markAttendance = async (req, res) => {
    const { type } = req.body;

    try {
        const today = moment().startOf('day');
        const currentHour = moment().hour();

        const attendance = new Attendance({
            user: req.user.id,
            date: today,
            checkIn: new Date(),
            type,
            status: currentHour > 9 ? 'late' : 'present',
        });

        await attendance.save();

        res.status(201).json(attendance);
    } catch (error) {

        res.status(500).json({ message: 'Failed to mark attendance.' });
    }
};

export const getAttendanceReport = async (req, res) => {
    const { startDate, endDate, userId } = req.query;

    try {
        const query = {};

        if (userId) query.user = userId;
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const report = await Attendance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$user',
                    present: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'present'] }, 1, 0],
                        },
                    },
                    late: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'late'] }, 1, 0],
                        },
                    },
                    absent: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    name: '$user.name',
                    present: 1,
                    late: 1,
                    absent: 1,
                },
            },
        ]);

        res.json(report);
    } catch (error) {
        console.error('Attendance Report Error:', error.message);
        res.status(500).json({ message: 'Failed to generate attendance report.' });
    }
};