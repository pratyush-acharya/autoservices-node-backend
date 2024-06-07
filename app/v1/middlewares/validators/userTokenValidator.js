import { User } from '../../models/UserSchema.js';

export const validateUser = async (value) => {
    return User.findById(value).then(user => {
        if(!user){
            return Promise.reject('Invalid User Id');
        }
    });
}