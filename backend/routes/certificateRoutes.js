const express = require("express");
const { getCompletedUsers, generateCertificate } = require("../controllers/certificateController");

const router = express.Router();

router.get("/users/completed", getCompletedUsers);
router.post("/certificates/generate/:userId", generateCertificate);

module.exports = router;
