import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
export const newUser = async (req, // additional type safety
res, next) => {
    try {
        // we are customizing "req" above only
        // providing type information that helps TypeScript
        // understand the structure of the request body
        const { name, email, photo, gender, _id, dob } = req.body;
        const user = await User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob
        });
        return res.status(201).json({
            success: true,
            message: `Welcome, ${user.name}`
        });
    }
    catch (error) {
        return next(new ErrorHandler("Cannot Create User", 400));
    }
};
