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
    const log = await logService.getLogById(req.params.logId);
    res.status(200).json(log);
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Unauthorized")
    ) {
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
    if (isNaN(userId)) {
      throw new Error("Invalid userId");
    }
    if (userId <= 0) {
      throw new Error("UserId must be greater than 0");
    }

    const logs = await logService.getUserLogs(userId);
    res.status(200).json(logs);
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Unauthorized")
    ) {
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
    if (isNaN(userId)) {
      throw new Error("Invalid userId");
    }
    if (userId <= 0) {
      throw new Error("UserId must be greater than 0");
    }

    let { logId } = req.params;
    logId = parseInt(logId, 10);
    if (isNaN(logId)) {
      throw new Error("Invalid logId");
    }
    if (logId <= 0) {
      throw new Error("LogId must be greater than 0");
    }

    const log = await logService.getUserLog(userId, logId);
    res.status(200).json(log);
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("Unauthorized")
    ) {
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
