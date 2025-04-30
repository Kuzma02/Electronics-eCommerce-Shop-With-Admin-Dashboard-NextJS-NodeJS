const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Helper function to ensure upload directory exists
const ensureUploadDirExists = async (projectId) => {
  // Create main uploads directory if it doesn't exist
  const mainUploadDir = path.join(process.cwd(), 'server', 'uploads');
  await fs.promises.mkdir(mainUploadDir, { recursive: true });
  
  // Create project-specific directory
  const projectUploadDir = path.join(mainUploadDir, projectId);
  await fs.promises.mkdir(projectUploadDir, { recursive: true });
  
  return projectUploadDir;
};

// Get all projects for the authenticated user
const getAllProjects = async (req, res) => {
  try {
    // Get user ID from request (authentication will be handled by middleware)
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projects = await prisma.project.findMany({
      where: { contractorId: userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific project
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.contractorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new project with optional file uploads
const createProject = async (req, res) => {
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

    // Handle file uploads if any
    if (req.files) {
      const uploadDir = await ensureUploadDirExists(project.id);
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

      for (const file of files) {
        const fileExtension = path.extname(file.name);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join('uploads', project.id, fileName);
        const fullPath = path.join(process.cwd(), 'server', filePath);

        // Move file to project directory
        await file.mv(fullPath);

        // Create ProjectFile record
        await prisma.projectFile.create({
          data: {
            projectId: project.id,
            filename: fileName,
            originalname: file.name,
            mimetype: file.mimetype,
            size: file.size,
            path: filePath,
          }
        });
      }
    }

    // Return project with files
    const projectWithFiles = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        files: true
      }
    });

    res.status(201).json(projectWithFiles);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.contractorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Update the project
    const project = await prisma.project.update({
      where: { id },
      data: { name },
    });

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.contractorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Delete the project (this will cascade delete projectfiles due to the foreign key constraint)
    await prisma.project.delete({
      where: { id },
    });

    // Remove associated files from filesystem
    const uploadDir = path.join(process.cwd(), 'server', 'uploads', id);
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to handle file uploads
const handleFileUploads = async (files, projectId) => {
  const uploadDir = await ensureUploadDirExists(projectId);
  const uploadedFiles = [];
  
  // Handle multiple files in an array
  if (Array.isArray(files.files)) {
    for (const file of files.files) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join('uploads', projectId, fileName);
      const fullPath = path.join(process.cwd(), 'server', filePath);
      
      await file.mv(fullPath);
      
      // Save file information in projectfile table
      const projectFile = await prisma.projectFile.create({
        data: {
          projectId: projectId,
          filename: fileName,
          originalname: file.name,
          mimetype: file.mimetype,
          size: file.size,
          path: filePath,
        }
      });
      
      uploadedFiles.push(projectFile);
    }
  } 
  // Handle single file upload
  else if (files.files) {
    const file = files.files;
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join('uploads', projectId, fileName);
    const fullPath = path.join(process.cwd(), 'server', filePath);
    
    await file.mv(fullPath);
    
    // Save file information in projectfile table
    const projectFile = await prisma.projectFile.create({
      data: {
        projectId: projectId,
        filename: fileName,
        originalname: file.name,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath,
      }
    });
    
    uploadedFiles.push(projectFile);
  }
  
  return uploadedFiles;
};

// Upload files for a project
const uploadFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.contractorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Check if files are provided
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Handle the file uploads
    const uploadedFiles = await handleFileUploads(req.files, id);

    // For each file, create a placeholder ProjectProduct
    // Note: In a real implementation, you might want to parse the files and create products accordingly
    for (const file of uploadedFiles) {
      await prisma.projectProduct.create({
        data: {
          projectId: id,
          productId: "placeholder-id", // You would need to determine the actual product ID
          quantity: 1,
        },
      });
    }

    res.status(200).json({ message: 'Files uploaded successfully', files: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get uploaded files for a project
const getProjectFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.contractorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Get files from projectfile table
    const files = await prisma.projectFile.findMany({
      where: {
        projectId: id
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    res.status(200).json(files);
  } catch (error) {
    console.error('Error getting project files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a project file record
const createProjectFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { filename, originalname, path, mimetype, size } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.contractorId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Create file record
    const file = await prisma.projectFile.create({
      data: {
        projectId: id,
        filename,
        originalname,
        path,
        mimetype,
        size,
      }
    });

    res.status(201).json(file);
  } catch (error) {
    console.error('Error creating project file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload materials from a PDF file
const uploadMaterialFromFile = async (req, res) => {
  try {
    const { projectId, filePath } = req.body;
    
    if (!projectId || !filePath) {
      return res.status(400).json({ message: 'Project ID and file path are required' });
    }

    // Verify the project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (existingProject.contractorId !== req.user?.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Check if file exists
    const fullFilePath = path.join(process.cwd(), 'server', filePath);
    const fileExists = await fs.promises.access(fullFilePath)
      .then(() => true)
      .catch(() => false);
    
    if (!fileExists) {
      return res.status(404).json({ message: 'File not found' });
    }

    // In a real implementation, you would parse the PDF and extract materials
    // For now, we'll create a placeholder material
    const newMaterial = await prisma.projectProduct.create({
      data: {
        projectId,
        productId: "default-product-id", // You would need to determine the actual product ID
        quantity: 1,
      },
    });

    // Update the project's item count
    await prisma.project.update({
      where: { id: projectId },
      data: { itemCount: { increment: 1 } },
    });

    return res.status(200).json({ message: 'Material uploaded successfully', material: newMaterial });
  } catch (error) {
    console.error('Error uploading material from file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all uploaded files
const getUploadedFiles = async (req, res) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'server', 'uploads');
    await fs.promises.mkdir(uploadDir, { recursive: true });
    
    // Read the directory
    const files = await fs.promises.readdir(uploadDir)
      .catch(error => {
        console.error(`Error reading directory: ${error.message}`);
        return []; // Return empty array if directory can't be read
      });
    
    // Filter for PDF files
    const pdfFiles = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => ({
        name: file,
        path: `uploads/${file}`
      }));
    
    return res.status(200).json(pdfFiles);
  } catch (error) {
    console.error('Error getting uploaded files:', error);
    // Return empty array instead of error
    return res.status(200).json([]);
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  uploadFiles,
  getProjectFiles,
  createProjectFile,
  uploadMaterialFromFile,
  getUploadedFiles
};