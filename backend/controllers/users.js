const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ authenticated: true, user: req.user });
    }
    res.json({ authenticated: false });
}

module.exports.createUser = (req, res, next) => {
    const { username, password, email } = req.body.user;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newUser = new User({
        username: username,
        email: email.toLowerCase()
    });

    User.register(newUser, password, (err, registeredUser) => {
        if (err) {
            // Handle duplicate username/email gracefully
            return res.status(400).json({
                success: false,
                message: err.message || 'Registration failed'
            });
        }

        req.login(registeredUser, (loginErr) => {
            if (loginErr) {
                return res.status(400).json({
                    success: false,
                    message: 'Registered but login failed: ' + loginErr.message
                });
            }

            return res.status(201).json({
                success: true,
                message: 'User registered and logged in successfully',
                user: {
                    username: registeredUser.username,
                    email: registeredUser.email,
                    _id: registeredUser._id
                }
            });
        });
    });
};

module.exports.renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ authenticated: true, user: req.user });
    }
    res.json({ authenticated: false });
}

module.exports.loginUser = async (req, res) => {
    res.json({
        success: true,
        message: `Successfully logged in ${req.user.username}`,
        user: req.user
    });
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(400).json({ message: 'Logout failed', error: err });
        }
        res.json({ success: true, message: 'Successfully logged out' });
    });
};

module.exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || '',
                profilePicture: user.profilePicture || ''
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, city, country, profilePicture } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.city = city || user.city;
        user.country = country || user.country;
        
        // Only update email if it's being changed and not already in use
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
            user.email = email.toLowerCase();
        }

        // Handle profile picture if provided
        if (profilePicture) {
            user.profilePicture = profilePicture;
        }

        await user.save();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                city: user.city,
                country: user.country,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.changeUsername = async (req, res) => {
    try {
        const { newUsername } = req.body;
        const userId = req.user._id;

        if (!newUsername || newUsername.trim() === '') {
            return res.status(400).json({ success: false, message: 'New username is required' });
        }

        // Check if new username already exists
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const oldUsername = user.username;
        user.username = newUsername;
        await user.save();

        res.json({
            success: true,
            message: 'Username changed successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                address: user.address,
                city: user.city,
                country: user.country,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user._id;

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All password fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify old password
        user.changePassword(oldPassword, newPassword, (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message || 'Current password is incorrect' });
            }

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};