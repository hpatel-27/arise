import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const STAT_OPTIONS = [
  { id: 1, name: "Strength" },
  { id: 2, name: "Intelligence" },
  { id: 3, name: "Vitality" },
  { id: 4, name: "Agility" },
  { id: 5, name: "Perception" },
];

export function TaskForm({ isOpen, onClose, onSubmit, task = null }) {
  const [name, setName] = useState(task?.name || "");
  const [requirement, setRequirement] = useState(task?.requirement || "");
  const [xpValue, setXpValue] = useState(task?.xpValue || 100);
  const [categoryId, setCategoryId] = useState(task?.categoryId || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      requirement,
      xpValue: parseInt(xpValue),
      categoryId: parseInt(categoryId),
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
            required
          />
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
          />
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
            required
          />
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
