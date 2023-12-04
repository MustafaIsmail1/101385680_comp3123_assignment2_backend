const express = require("express");
const mongoose = require('mongoose');

const EmployeeModel = require('../models/Employees');
const app = express();

app.get("/employees", async (req, res) => {
    try {
        const employeeList = await EmployeeModel.find({});
        res.status(200).send(employeeList);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/employees", async (req, res) => {
    try {
        const newEmployee = new EmployeeModel({ ...req.body });
        await newEmployee.save();
        res.status(200).send(newEmployee);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/employees/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
        return res.status(400).send({
            message: "Employee ID is required"
        });
    }
    EmployeeModel.findById(employeeId)
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: "employee not found with ID: " + employeeId
                });
            }
            res.status(200).send(employee);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving employee with ID: " + employeeId
            });
        });
});

app.put('/employees/:employeeId', (req, res) => {
    const eid = req.params.employeeId;

    if (!mongoose.Types.ObjectId.isValid(eid)) {
        return res.status(400).send({
            message: "Invalid Employee ID"
        });
    }

    const updateFields = {};
    
    if (req.body.first_name) {
        updateFields.first_name = req.body.first_name;
    }
    
    if (req.body.last_name) {
        updateFields.last_name = req.body.last_name;
    }
    
    if (req.body.email) {
        updateFields.email = req.body.email;
    }

    if (req.body.gender) {
        updateFields.gender = req.body.gender;
    }

    if (req.body.salary) {
        updateFields.salary = req.body.salary;
    }




    EmployeeModel.findByIdAndUpdate(eid, updateFields, { new: true })
        .then(updatedEmployee => {
            if (!updatedEmployee) {
                return res.status(404).send({
                    message: "Employee not found with ID: " + eid
                });
            }
            res.status(200).send(updatedEmployee);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating employee with ID: " + eid
            });
        });
});


app.delete('/employees/:employeeId', (req, res) => {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
        return res.status(400).send({
            message: "employee ID is required"
        });
    }
    EmployeeModel.findByIdAndRemove(employeeId)
        .then(deletedEmployee => {
            if (!deletedEmployee) {
                return res.status(404).send({
                    message: "employee not found with ID: " + employeeId
                });
            }
            res.status(200).send({ message: "Employee deleted successfully!" });
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete employee with ID: " + employeeId
            });
        });
});

module.exports = app;
