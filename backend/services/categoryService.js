const prisma = require("../db");

async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });
  return categories;
}

async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!category) throw new Error(`Category with id "${id}" not found`);

  return category;
}

async function createCategory(data) {
  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });
  if (existingCategory) throw new Error("Category already exists.");

  const category = await prisma.category.create({ data });
  return category;
}

async function updateCategory(id, data) {
  // Check that the record exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: id },
  });
  if (!existingCategory) throw new Error("Category not found.");

  const category = await prisma.category.update({
    where: { id: parseInt(id, 10) },
    data,
  });
  return category;
}

async function deleteCategory(id) {
  // Check that the record exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: id },
  });
  if (!existingCategory) {
    throw new Error("Category not found.");
  }

  const category = await prisma.category.delete({
    where: { id: parseInt(id, 10) },
  });
  return category;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
