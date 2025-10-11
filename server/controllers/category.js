const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { asyncHandler, AppError } = require("../utills/errorHandler");

const createCategory = asyncHandler(async (request, response) => {
  const { name } = request.body;

  if (!name || name.trim().length === 0) {
    throw new AppError("Category name is required", 400);
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
    },
  });
  return response.status(201).json(category);
});

const updateCategory = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { name } = request.body;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  if (!name || name.trim().length === 0) {
    throw new AppError("Category name is required", 400);
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: existingCategory.id,
    },
    data: {
      name: name.trim(),
    },
  });

  return response.status(200).json(updatedCategory);
});

const deleteCategory = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  const existingCategory = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  // Check if category has products
  const productsWithCategory = await prisma.product.findFirst({
    where: {
      categoryId: id,
    },
  });

  if (productsWithCategory) {
    throw new AppError("Cannot delete category that has products", 400);
  }

  await prisma.category.delete({
    where: {
      id: id,
    },
  });
  return response.status(204).send();
});

const getCategory = asyncHandler(async (request, response) => {
  const { id } = request.params;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  
  return response.status(200).json(category);
});

const getAllCategories = asyncHandler(async (request, response) => {
  const categories = await prisma.category.findMany({});
  return response.json(categories);
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
