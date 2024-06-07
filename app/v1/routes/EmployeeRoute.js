import {Router} from "express";
import {
    createEmployee,
    getAllEmployee,
    getEmployee,
    updateEmployee,
    removeEmployee
} from "../controllers/EmployeeController.js";

import {
    createEmployeeValidator,
    updateEmployeeValidator
} from "../middlewares/validators/EmployeeValidator.js";


export const router = Router();

router.route('/')
    .get(getAllEmployee)
    .post(createEmployeeValidator, createEmployee)

router.route('/:id')
    .get(getEmployee)
    .put(updateEmployeeValidator, updateEmployee)
    .delete(removeEmployee);