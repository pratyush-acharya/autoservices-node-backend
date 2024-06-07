import * as mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },

    designation: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    }
})

export const Employee = mongoose.model('employees', EmployeeSchema);