const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ensure the uploads directory exists
const ensureUploadDirExists = async () => {
  const uploadDir = path.join(process.cwd(), 'server', 'uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });
  return uploadDir;
};

// Upload a new file
const uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFile = req.files.uploadedFile;

    // Validate file type
    if (uploadedFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = await ensureUploadDirExists();
    
    // Create a unique filename
    const uniqueFileName = `${uuidv4()}-${uploadedFile.name}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    
    // Move the file to the uploads directory
    await uploadedFile.mv(filePath);
    
    return res.status(200).json({ 
      filePath: `uploads/${uniqueFileName}`,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all uploaded files
const getUploadedFiles = async (req, res) => {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = await ensureUploadDirExists();
    
    // Check if directory exists before reading
    const files = await fs.promises.readdir(uploadDir)
      .catch(error => {
        console.error(`Error reading directory: ${error.message}`);
        return []; // Return empty array if directory can't be read
      });
    
    // Filter for PDF files
    const pdfFiles = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => ({
        name: file.substring(file.indexOf('-') + 1), // Remove UUID prefix
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
  uploadFile,
  getUploadedFiles
};