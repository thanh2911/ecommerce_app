import { generateAccessToken, generateRefreshToken } from "../middleware/generateToken.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';

const userCtrl = {
    createUser: async (req, res) =>  {
        try {
             const { firstname, lastname, email, mobile, password} = req.body;

            const findUser = await User.findOne({email});
            if(findUser) 
                return res.status(400).json({msg: 'Email already exists'});

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = await User.create({
                firstname, lastname, email, mobile, password: passwordHash
            })

            res.json({
                status: 'Register success',
                msg: newUser
            });


        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    loginUser: async (req, res) =>  {
        try {
             const {  email, password} = req.body;

            const findUser = await User.findOne({email});
            if(!findUser) 
                return res.status(400).json({msg: 'This account does not exists'});

            const isMatch = await bcrypt.compare(password, findUser.password);

            if(!isMatch) return res.status(400).json({msg: 'Password is incorrect.'});

            const access_token = generateAccessToken({id: findUser._id});
            const refresh_token = generateRefreshToken({id: findUser._id});
        
            res.cookie('refresh_token',refresh_token, {
                httpOnly: true,
                path: `/api/refresh_token`,
                maxAge: 30*24*60*60*1000 // 30 days
            });

            res.json({
            status: 'Login Success !',
            access_token,
            user: {...findUser._doc}
            });


        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    getAllUsers: async (req, res) =>  {
        try {
             const getUsers = await User.find();
             
             res.json({
                status: "Find success",
                msg: getUsers
             })

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    getUser: async (req, res) =>  {
        // console.log(req.params);
        const { id } = req.params
        try {
            const findUser = await User.findById(id).select('-password')
            if(!findUser) return res.status(400).json({msg: "User does not exist."})

            res.json({
                status: "Find success",
                msg: findUser
            })

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    deleteUser: async (req, res) =>  {
        // console.log(req.params);
        const { id } = req.params
        try {
            const deleteUser = await User.findByIdAndDelete(id);
            if(!deleteUser) return res.status(400).json({msg: "User does not exist."})

            res.json({
                status: "Delete success",
                msg: deleteUser
            })

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

}

export default userCtrl;