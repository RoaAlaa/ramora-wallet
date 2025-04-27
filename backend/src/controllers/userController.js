const UserService = require('../services/UserService');

exports.register = async (req,res) =>{
try{
const {user, token} = await UserService.register(req.body);
res.status(201).json({
    message: 'User registered successfully',
    user,
    token
});
}
catch (error){
    res.status(400).json({ error: error.message });
}
};

exports.login = async (req, res) => {
    try{
        const {user, token} = await UserService.login(req.body);
        res.status(200).json({
            message: 'user login successfully',
            user,
            token
        });
    }
    catch (error){
        res.status(400).json({ error: error.message });
    }
}