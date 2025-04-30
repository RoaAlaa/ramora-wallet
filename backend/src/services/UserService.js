const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Normally keep this in env variables
const JWT_SECRET = process.env.JWT_SECRET_KEY;
// fel env ely oltly 3aleha el sobh 


class UserService{
    async register({name, username, email, phoneNumber,password})
    {
        const existingUser = await User.findOne({email});
        if (existingUser)
        {
            throw new Error('User is already exists');
        }

        const newUser = new User({
            name,
            username,
            email,
            phoneNumber,
            password
        });

        await newUser.save();

        const token = this.generateToken(newUser._id);
        return { user: newUser, token };
    }

    async login({username,password})
    {
        const user = await User.findOne({username});

        if(!user)
        {
            throw new Error('Invalid username or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            throw new Error('Invalid username or password');
        }
        const token = this.generateToken(user._id);

        return { user, token };
    
    }

    generateToken(userId)
    {
        return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
    }

}

module.exports = new UserService();