const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCategory(request, response) {
  try {
    console.log("Creating category:", request.body);
    const { name } = request.body;
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    console.log("Category created:", category);
    return response.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return response.status(500).json({ error: "Error creating category" });
  }
}

async function updateCategory(request, response) {
  try {
    const { id } = request.params;
    console.log("Updating category with id:", id);
    const { name } = request.body;

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingCategory) {
      return response.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: existingCategory.id,
      },
      data: {
        name,
      },
    });

    return response.json(updatedCategory);
  } catch (error) {
    return response.status(500).json({ error: "Error updating category" });
  }
}

async function deleteCategory(request, response) {
  try {
    const { id } = request.params;
    console.log("Deleting category with id:", id);
    await prisma.category.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error: "Error deleting category" });
  }
}

async function getCategory(request, response) {
  const { id } = request.params;
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  console.log(category);
  if (!category) {
    return response.status(404).json({ error: "Category not found" });
  }
  return response.status(200).json(category);
}

async function getAllCategories(request, response) {
  try {
    const categories = await prisma.category.findMany({});
    return response.json(categories);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching categories" });
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
