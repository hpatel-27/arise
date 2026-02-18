import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const STAT_OPTIONS = [
  { id: 1, name: "Strength" },
  { id: 2, name: "Agility" },
  { id: 3, name: "Intelligence" },
  { id: 4, name: "Vitality" },
  { id: 5, name: "Perception" },
];

const VALID_CATEGORY_IDS = new Set([1, 2, 3, 4, 5]);
const NAME_MAX_LENGTH = 100;
const REQUIREMENT_MAX_LENGTH = 500;

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, "");
}

function validateTaskInput({ name, requirement, xpValue, categoryId }) {
  const errors = {};

  const trimmedName = stripHtml(name.trim());
  if (!trimmedName) {
    errors.name = "Task name is required.";
  } else if (trimmedName.length > NAME_MAX_LENGTH) {
    errors.name = `Task name cannot exceed ${NAME_MAX_LENGTH} characters.`;
  }

  const trimmedRequirement = stripHtml(requirement.trim());
  if (trimmedRequirement.length > REQUIREMENT_MAX_LENGTH) {
    errors.requirement = `Requirement cannot exceed ${REQUIREMENT_MAX_LENGTH} characters.`;
  }

  const parsedXp = parseInt(xpValue, 10);
  if (isNaN(parsedXp) || parsedXp < 1 || parsedXp > 9999) {
    errors.xpValue = "XP value must be between 1 and 9999.";
  }

  const parsedCategoryId = parseInt(categoryId, 10);
  if (!VALID_CATEGORY_IDS.has(parsedCategoryId)) {
    errors.categoryId = "Please select a valid stat category.";
  }

  return errors;
}

export function TaskForm({ isOpen, onClose, onSubmit, task = null }) {
  const [name, setName] = useState(task?.name || "");
  const [requirement, setRequirement] = useState(task?.requirement || "");
  const [xpValue, setXpValue] = useState(task?.xpValue || 100);
  const [categoryId, setCategoryId] = useState(task?.categoryId || 1);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateTaskInput({
      name,
      requirement,
      xpValue,
      categoryId,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit({
      name: stripHtml(name.trim()),
      requirement: stripHtml(requirement.trim()),
      xpValue: parseInt(xpValue, 10),
      categoryId: parseInt(categoryId, 10),
    });
    // Reset form
    setName("");
    setRequirement("");
    setXpValue(100);
    setCategoryId(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Create Task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-pixel text-xs text-white mb-2">
            Task Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter task name"
            maxLength={NAME_MAX_LENGTH}
            required
          />
          {errors.name && (
            <p className="font-pixel text-xs text-red-400 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block font-pixel text-xs text-white mb-2">
            Requirement
          </label>
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Enter task requirement"
            className="w-full px-4 py-2 border-4 border-dark bg-background text-white font-pixel text-xs resize-none"
            rows="3"
            maxLength={REQUIREMENT_MAX_LENGTH}
          />
          {errors.requirement && (
            <p className="font-pixel text-xs text-red-400 mt-1">{errors.requirement}</p>
          )}
        </div>

        <div>
          <label className="block font-pixel text-xs text-white mb-2">
            XP Value
          </label>
          <Input
            type="number"
            value={xpValue}
            onChange={(e) => setXpValue(e.target.value)}
            placeholder="100"
            min="1"
            max="9999"
            required
          />
          {errors.xpValue && (
            <p className="font-pixel text-xs text-red-400 mt-1">{errors.xpValue}</p>
          )}
        </div>

        <div>
          <label className="block font-pixel text-xs text-white mb-2">
            Stat Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border-4 border-dark bg-background text-white font-pixel text-xs"
          >
            {STAT_OPTIONS.map((stat) => (
              <option key={stat.id} value={stat.id}>
                {stat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="font-pixel text-xs text-red-400 mt-1">{errors.categoryId}</p>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            {task ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
