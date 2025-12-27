const categoryService = require("../services/categoryService");
const pickFields = require("../utils/pickFields");
const { categoryDTO } = require("../dtos/category.dto");

async function getAllCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories.map(categoryDTO));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCategoryById(req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id, 10);

    const category = await categoryService.getCategoryById(id);
    res.json(categoryDTO(category));
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("not valid")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function createCategory(req, res) {
  try {
    console.log("Creating category with this data", req.body);
    const data = {
      name: req.body.name,
      description: req.body.description,
    };

    const category = await categoryService.createCategory(data);
    res.status(201).json(categoryDTO(category));
  } catch (error) {
    if (error.message.includes("already exists")) {
      res
        .status(409)
        .json({ error: `Category "${data.name}" already exists.` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function updateCategory(req, res) {
  try {
    console.log("Updating category with this data", req.body);
    const data = pickFields(req.body, ["name", "description"]);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    let { id } = req.params;
    id = parseInt(id, 10);

    const category = await categoryService.updateCategory(id, data);
    res.json(categoryDTO(category));
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function deleteCategory(req, res) {
  try {
    console.log("Deleting achievement with ID:", req.params.id);
    let { id } = req.params;
    id = parseInt(id, 10);

    const category = await categoryService.deleteCategory(id);
    res.json(categoryDTO(category));
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
