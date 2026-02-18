const VALID_CATEGORY_IDS = new Set([1, 2, 3, 4, 5]);
const NAME_MAX_LENGTH = 100;
const REQUIREMENT_MAX_LENGTH = 500;
const XP_MIN = 1;
const XP_MAX = 9999;

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, "");
}

function sanitizeTaskInput({ name, requirement, xpValue, categoryId }) {
  const errors = [];

  // name: required, string, 1-100 chars, no HTML
  if (name === undefined || name === null) {
    errors.push("Task name is required.");
  } else if (typeof name !== "string") {
    errors.push("Task name must be a string.");
  } else {
    name = stripHtml(name.trim());
    if (name.length === 0) {
      errors.push("Task name cannot be empty.");
    } else if (name.length > NAME_MAX_LENGTH) {
      errors.push(`Task name cannot exceed ${NAME_MAX_LENGTH} characters.`);
    }
  }

  // requirement: optional string, 0-500 chars, no HTML
  if (requirement === undefined || requirement === null) {
    requirement = "";
  } else if (typeof requirement !== "string") {
    errors.push("Requirement must be a string.");
  } else {
    requirement = stripHtml(requirement.trim());
    if (requirement.length > REQUIREMENT_MAX_LENGTH) {
      errors.push(
        `Requirement cannot exceed ${REQUIREMENT_MAX_LENGTH} characters.`
      );
    }
  }

  // xpValue: integer, 1-9999
  xpValue = parseInt(xpValue, 10);
  if (isNaN(xpValue)) {
    errors.push("XP value must be a number.");
  } else if (xpValue < XP_MIN || xpValue > XP_MAX) {
    errors.push(`XP value must be between ${XP_MIN} and ${XP_MAX}.`);
  }

  // categoryId: integer, must be one of the 5 valid stat categories
  categoryId = parseInt(categoryId, 10);
  if (isNaN(categoryId) || !VALID_CATEGORY_IDS.has(categoryId)) {
    errors.push(
      "Category ID must be 1 (Strength), 2 (Agility), 3 (Intelligence), 4 (Vitality), or 5 (Perception)."
    );
  }

  if (errors.length > 0) {
    const err = new Error(errors.join(" "));
    err.statusCode = 400;
    err.errors = errors;
    throw err;
  }

  return { name, requirement, xpValue, categoryId };
}

module.exports = { sanitizeTaskInput };
