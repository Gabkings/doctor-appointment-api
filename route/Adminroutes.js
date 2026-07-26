const express = require("express");
const router = express.Router();
const User = require("../models/Usersmodel");
const Doctor = require("../models/Doctorsmodel");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/get-all-doctors", authMiddleware, async(req, res) => {
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

router.get("/get-all-users", authMiddleware, async(req, res) => {
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

router.post(
    "/change-doctor-account-status",
    authMiddleware,
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



module.exports = router;