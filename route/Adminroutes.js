const express = require("express");
const router = express.Router();
const User = require("../models/Usersmodel");
const Doctor = require("../models/Doctorsmodel");
const Appointment = require("../models/appointmentModel");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = authMiddleware;

router.get("/get-all-doctors", authMiddleware, authorizeRoles("admin"), async(req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).send({
            message: "Doctors fetched successfully",
            success: true,
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

router.get("/get-all-users", authMiddleware, authorizeRoles("admin"), async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            message: "Users fetched successfully",
            success: true,
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

router.get("/get-all-appointments", authMiddleware, authorizeRoles("admin"), async(req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.status(200).send({
            message: "Appointments fetched successfully",
            success: true,
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error fetching appointments",
            success: false,
            error,
        });
    }
});

router.post(
    "/change-doctor-account-status",
    authMiddleware,
    authorizeRoles("admin"),
    async(req, res) => {
        try {
            const { doctorId, status } = req.body;

            // Update doctor status with { new: true } to get updated document
            const doctor = await Doctor.findByIdAndUpdate(
                doctorId,
                { status },
                { new: true }
            );

            if (!doctor) {
                return res.status(404).send({
                    message: "Doctor not found",
                    success: false,
                });
            }

            // Find user by doctor's userId
            const user = await User.findById(doctor.userId);

            if (!user) {
                return res.status(404).send({
                    message: "User not found",
                    success: false,
                });
            }

            // Initialize unseenNotifications if it doesn't exist
            if (!user.unseenNotifications) {
                user.unseenNotifications = [];
            }

            // Push notification
            user.unseenNotifications.push({
                type: "new-doctor-request-changed",
                message: `Your doctor account has been ${status}`,
                onClickPath: "/notifications",
            });

            // Update isDoctor flag based on status
            user.isDoctor = status === "approved" ? true : false;

            // Save user changes
            await user.save();

            res.status(200).send({
                message: "Doctor status updated successfully",
                success: true,
                data: doctor,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Error updating doctor account status",
                success: false,
                error,
            });
        }
    }
);



router.delete("/delete-doctor/:doctorId", authMiddleware, authorizeRoles("admin"), async(req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.doctorId);
        if (!doctor) {
            return res.status(404).send({ message: "Doctor not found", success: false });
        }

        await User.findByIdAndUpdate(doctor.userId, { isDoctor: false });

        res.status(200).send({
            message: "Doctor deleted successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).send({ message: "Error deleting doctor", success: false, error });
    }
});

router.delete("/delete-user/:userId", authMiddleware, authorizeRoles("admin"), async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }

        await Doctor.deleteMany({ userId: req.params.userId });
        await Appointment.deleteMany({ userId: req.params.userId });

        res.status(200).send({
            message: "User deleted successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).send({ message: "Error deleting user", success: false, error });
    }
});

router.delete("/delete-appointment/:appointmentId", authMiddleware, authorizeRoles("admin"), async(req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.appointmentId);
        if (!appointment) {
            return res.status(404).send({ message: "Appointment not found", success: false });
        }

        res.status(200).send({
            message: "Appointment deleted successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).send({ message: "Error deleting appointment", success: false, error });
    }
});

module.exports = router;