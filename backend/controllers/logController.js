const logService = require("../services/logService");

async function getAllLogs(req, res) {
  try {
    const logs = await logService.getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function getLogById(req, res) {
  try {
    let { logId } = req.params;
    logId = parseInt(logId, 10);
    if (isNaN(logId) || logId <= 0) {
      return res.status(400).json({ error: "Invalid logId" });
    }
    const log = await logService.getLogById(logId);
    res.status(200).json(log);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function getUserLogs(req, res) {
  try {
    let { userId } = req.params;
    userId = parseInt(userId, 10);
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const logs = await logService.getUserLogs(userId);
    res.status(200).json(logs);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function getUserLog(req, res) {
  try {
    let { userId } = req.params;
    userId = parseInt(userId, 10);
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    let { logId } = req.params;
    logId = parseInt(logId, 10);
    if (isNaN(logId) || logId <= 0) {
      return res.status(400).json({ error: "Invalid logId" });
    }

    const log = await logService.getUserLog(userId, logId);
    res.status(200).json(log);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  getAllLogs,
  getLogById,
  getUserLogs,
  getUserLog,
};
