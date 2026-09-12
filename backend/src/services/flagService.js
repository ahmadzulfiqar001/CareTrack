function isOverdue(nextCheckup) {
  if (!nextCheckup) return false;
  return new Date(nextCheckup) < new Date();
}

module.exports = { isOverdue };