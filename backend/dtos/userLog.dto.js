// UserLog is a record of a user's action in the app
// It is used by admin to view user activity
function userLogDTO(userLog) {
  return {
    id: userLog.id,
    userId: userLog.userId,
    type: userLog.type,
    timestamp: userLog.timestamp,
    metadata: userLog.metadata,
  };
}

module.exports = { userLogDTO };
