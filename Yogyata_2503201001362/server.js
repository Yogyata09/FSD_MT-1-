
const express = require("express");

const app = express();

app.use(express.json());

// Initial Data
let leaves = [
    {
        id: 701,
        employeeName: "Ananya Singh",
        employeeCode: "EMP101",
        leaveType: "Casual",
        days: 2,
        status: "Pending"
    },
    {
        id: 702,
        employeeName: "Rahul Verma",
        employeeCode: "EMP102",
        leaveType: "Sick",
        days: 1,
        status: "Approved"
    },
    {
        id: 703,
        employeeName: "Simran Kaur",
        employeeCode: "EMP103",
        leaveType: "Earned",
        days: 3,
        status: "Rejected"
    }
];

// 1. GET all leave records
app.get("/api/leaves", (req, res) => {
    res.status(200).json(leaves);
});

// 2. POST new leave request
app.post("/api/leaves", (req, res) => {

    const { employeeName, employeeCode, leaveType, days, status } = req.body;

    if (!employeeName || !employeeCode || !leaveType || days === undefined || !status) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (!Number.isInteger(days) || days <= 0) {
        return res.status(400).json({
            message: "Days must be a positive integer"
        });
    }

    if (!["Casual", "Sick", "Earned"].includes(leaveType)) {
        return res.status(400).json({
            message: "Invalid leave type"
        });
    }

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    const newLeave = {
        id: leaves.length > 0
            ? Math.max(...leaves.map(l => l.id)) + 1
            : 701,
        employeeName,
        employeeCode,
        leaveType,
        days,
        status
    };

    leaves.push(newLeave);

    res.status(201).json(newLeave);
});

// 3. GET leave request by ID
app.get("/api/leaves/:id", (req, res) => {

    const id = Number(req.params.id);

    const leave = leaves.find(l => l.id === id);

    if (!leave) {
        return res.status(404).json({
            message: "Leave record not found"
        });
    }

    res.status(200).json(leave);
});

// 4. PUT update leave request
app.put("/api/leaves/:id", (req, res) => {

    const id = Number(req.params.id);

    const leave = leaves.find(l => l.id === id);

    if (!leave) {
        return res.status(404).json({
            message: "Leave record not found"
        });
    }

    const { employeeName, employeeCode, leaveType, days, status } = req.body;

    if (!employeeName || !employeeCode || !leaveType || days === undefined || !status) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (!Number.isInteger(days) || days <= 0) {
        return res.status(400).json({
            message: "Days must be a positive integer"
        });
    }

    if (!["Casual", "Sick", "Earned"].includes(leaveType)) {
        return res.status(400).json({
            message: "Invalid leave type"
        });
    }

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    leave.employeeName = employeeName;
    leave.employeeCode = employeeCode;
    leave.leaveType = leaveType;
    leave.days = days;
    leave.status = status;

    res.status(200).json(leave);
});

// 5. DELETE leave request
app.delete("/api/leaves/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = leaves.findIndex(l => l.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Leave record not found"
        });
    }

    leaves.splice(index, 1);

    res.status(200).json({
        message: "Leave record deleted successfully"
    });
});

// 6. FILTER leave requests by status
app.get("/api/leaves/filter", (req, res) => {

    const status = req.query.status;

    const filteredLeaves = leaves.filter(
        l => l.status.toLowerCase() === (status || "").toLowerCase()
    );

    res.status(200).json(filteredLeaves);
});

// 7. GET pending leave requests
app.get("/api/leaves/pending", (req, res) => {

    const pendingLeaves = leaves.filter(
        l => l.status === "Pending"
    );

    res.status(200).json(pendingLeaves);
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
