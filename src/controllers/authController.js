
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/refreshToken.js';


const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};


const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

export const register = async (req, res) => {
    const { name, email, password, role, manager } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, password: hashedPassword, role, manager });
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const refreshTokenDoc = new RefreshToken({
            user: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
        await refreshTokenDoc.save();

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                manager: user.manager,
            },
        });
    } catch (error) {
        res.status(500).json({ code: 'SERVER_ERROR', message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(process.env.JWT_SECRET);

    try {
        const user = await User.findOne({ email, isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const refreshTokenDoc = new RefreshToken({
            user: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
        await refreshTokenDoc.save();

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            code: 'NO_REFRESH_TOKEN',
            message: 'No refresh token provided',
        });
    }
    try {
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        const isExpired = storedToken?.expiresAt < new Date();

        if (!storedToken || isExpired) {
            return res.status(403).json({ message: 'Refresh token is invalid or has expired' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);

        if (!user || user.isDeleted) {
            return res.status(404).json({ message: 'The user associated with this token does not exist' });
        }
        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            accessToken: newAccessToken,
        });
    } catch (error) {
        res.status(401).json({ message: 'Could not verify refresh token. Please login again.' });
    }
};


export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({
            message: 'Refresh token is required for logout.',
        });
    }
    try {
        const result = await RefreshToken.deleteOne({ token: refreshToken });

        if (result.deletedCount === 0) {
            return res.status(404).json({

                message: 'Refresh token not found or already invalidated.',
            });
        }
        res.status(200).json({
            message: 'Logged out successfully.',
        });
    } catch (error) {
        res.status(500).json({

            message: 'An error occurred during logout.',

        });
    }
};