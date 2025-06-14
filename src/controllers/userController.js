import User from '../models/User.js';

export const getUsers = async (req, res) => {
    const { page = 1, limit = 10, search = '', role } = req.query;

    try {

        const filters = { isDeleted: false };
        if (search) {
            filters.name = { $regex: search, $options: 'i' };
        }
        if (role) {
            filters.role = role;
        }
        const users = await User.find(filters)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .select('-password');

        const totalUsers = await User.countDocuments(filters);

        res.status(200).json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: Number(page),
        });
    } catch (error) {

        res.status(500).json({
            message: 'An error occurred while fetching users.'
        });
    }
};


export const updateUser = async (req, res) => {

    try {
        const userId = req.params.id;
        const updateData = {
            ...req.body,
            updatedAt: new Date(),
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({

                message: 'User not found for the given ID.',
            });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({

            message: 'An error occurred while updating the user.',

        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error.' });
    }
};
