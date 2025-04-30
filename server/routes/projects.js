const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projects');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

// Get all projects for the current user
router.get('/', projectController.getAllProjects);

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;
    
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        contractorId: userId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all uploaded files (no project context)
router.get('/uploaded-files', projectController.getUploadedFiles);

// Upload material from a PDF file
router.post('/upload-material', projectController.uploadMaterialFromFile);

// Get a specific project
router.get('/:id', projectController.getProject);

// Update a project
router.put('/:id', projectController.updateProject);

// Delete a project
router.delete('/:id', projectController.deleteProject);

// Upload files for a project
router.post('/:id/files', projectController.uploadFiles);

// Get uploaded files for a project
router.get('/:id/files', projectController.getProjectFiles);

// Materials endpoints
// Get all materials for a project
router.get('/:id/materials', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Note: We're not checking project ownership here for simplicity

    // Fetch materials with associated product data
    const materials = await prisma.projectProduct.findMany({
      where: {
        projectId: id,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            mainImage: true,
            description: true,
          },
        },
      },
    });

    // Transform the data to include name property
    const transformedMaterials = materials.map((material) => ({
      ...material,
      name: material.product?.title || "Unknown Material",
      unit: "piece", // Default unit
    }));

    res.status(200).json(transformedMaterials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new material to a project
router.post('/:id/materials', async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    // Validate required fields
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create new project product entry
    const material = await prisma.projectProduct.create({
      data: {
        projectId: id,
        productId,
        quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            mainImage: true,
            description: true,
          },
        },
      },
    });

    // Add name property to response
    const transformedMaterial = {
      ...material,
      name: material.product.title,
    };

    // Update project item count
    await prisma.project.update({
      where: { id },
      data: { itemCount: { increment: 1 } },
    });

    res.status(201).json(transformedMaterial);
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a material
router.put('/:id/materials/:materialId', async (req, res) => {
  try {
    const { id, materialId } = req.params;
    const { quantity } = req.body;

    // Update the material
    const updatedMaterial = await prisma.projectProduct.update({
      where: {
        id: materialId,
        projectId: id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    // Transform to match expected format
    const material = {
      id: updatedMaterial.id,
      name: updatedMaterial.product.title,
      description: updatedMaterial.product.description,
      quantity: updatedMaterial.quantity,
      unit: "piece",
      productId: updatedMaterial.product.id
    };

    res.status(200).json(material);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a material
router.delete('/:id/materials/:materialId', async (req, res) => {
  try {
    const { id, materialId } = req.params;

    // First verify that the project exists and get current itemCount
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      prisma.projectProduct.delete({
        where: {
          id: materialId,
          projectId: id,
        },
      }),
      prisma.project.update({
        where: {
          id,
        },
        data: {
          // Ensure itemCount never goes below 0
          itemCount: Math.max(0, (project.itemCount || 0) - 1),
        },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Recalculate project item count
router.post('/:id/recalculate', async (req, res) => {
  try {
    const { id } = req.params;

    // First verify that the project exists
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Count the actual number of materials
    const actualCount = project.products.length;

    // Update the project with the correct count
    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        itemCount: actualCount,
      },
    });

    res.status(200).json({ itemCount: updatedProject.itemCount });
  } catch (error) {
    console.error("Error recalculating project:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a project file
router.delete('/:id/files/:fileId', async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify project exists and belongs to user
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.contractorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Get file details
    const file = await prisma.projectFile.findUnique({
      where: { id: fileId },
    });

    if (!file || file.projectId !== id) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from filesystem
    const fullPath = path.join(process.cwd(), 'server', file.path);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }

    // Delete file record from database
    await prisma.projectFile.delete({
      where: { id: fileId },
    });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;