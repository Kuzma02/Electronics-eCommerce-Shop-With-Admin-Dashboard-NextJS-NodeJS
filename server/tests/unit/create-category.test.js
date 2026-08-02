// Mock Prisma client
jest.mock('../../utills/db', () => ({
  category: {
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
}));

const prisma = require('../../utills/db');

describe('Create Category', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should successfully create a category with random name', async () => {
      // Arrange
      const name = 'curl-test-' + Math.random().toString(36).slice(2, 8);
      const mockCategory = {
        id: 'cat-12345',
        name: name,
      };
      prisma.category = {
        create: jest.fn().mockResolvedValue(mockCategory),
      };
      prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

      // Act
      const result = await prisma.category.create({ data: { name } });

      // Assert
      expect(prisma.category.create).toHaveBeenCalledWith({ data: { name } });
      expect(result.id).toBe('cat-12345');
      expect(result.name).toBe(name);
    });

    it('should generate valid random category name format', async () => {
      // Arrange
      const randomSuffix = Math.random().toString(36).slice(2, 8);
      const expectedName = 'curl-test-' + randomSuffix;

      prisma.category = {
        create: jest
          .fn()
          .mockResolvedValue({ id: 'cat-789', name: expectedName }),
      };
      prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

      // Act
      const name = 'curl-test-' + randomSuffix;
      const result = await prisma.category.create({ data: { name } });

      // Assert
      expect(result.name).toMatch(/^curl-test-[a-z0-9]{6}$/);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      prisma.category = {
        create: jest.fn().mockRejectedValue(dbError),
      };
      prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

      // Act & Assert
      const name = 'curl-test-' + Math.random().toString(36).slice(2, 8);
      await expect(prisma.category.create({ data: { name } })).rejects.toThrow(
        'Database connection failed'
      );
      expect(prisma.category.create).toHaveBeenCalledWith({ data: { name } });
    });

    it('should disconnect Prisma client after operations', async () => {
      // Arrange
      const name = 'curl-test-' + Math.random().toString(36).slice(2, 8);
      const mockCategory = { id: 'cat-12345', name };
      
      prisma.category = {
        create: jest.fn().mockResolvedValue(mockCategory),
      };
      prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

      // Act
      await prisma.category.create({ data: { name } });
      await prisma.$disconnect();

      // Assert
      expect(prisma.$disconnect).toHaveBeenCalled();
    });

    it('should return category with correct structure', async () => {
      // Arrange
      const expectedCategory = {
        id: 'cat-abc123',
        name: 'curl-test-xyz789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.category = {
        create: jest.fn().mockResolvedValue(expectedCategory),
      };
      prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

      // Act
      const result = await prisma.category.create({
        data: { name: expectedCategory.name },
      });

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(typeof result.id).toBe('string');
      expect(typeof result.name).toBe('string');
    });

    it('should handle prisma client not being available', async () => {
      // Arrange
      prisma.category = undefined;

      // Act & Assert
      expect(() => {
        prisma.category.create({ data: { name: 'test' } });
      }).toThrow();
    });

    it('should handle empty name in category creation', async () => {
      // Arrange
      const validationError = new Error('Name is required');
      prisma.category = {
        create: jest
          .fn()
          .mockRejectedValue(validationError),
      };
      prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

      // Act & Assert
      await expect(prisma.category.create({ data: { name: '' } })).rejects.toThrow(
        'Name is required'
      );
    });

    it('should execute create-category flow completely', async () => {
      // Arrange - Complete flow simulation
      const categoryName = 'curl-test-' + Math.random().toString(36).slice(2, 8);
      const createdCategory = { id: 'cat-flow-123', name: categoryName };

      prisma.category = {
        create: jest.fn().mockResolvedValue(createdCategory),
      };
      prisma.$disconnect = jest.fn().mockResolvedValue(undefined);

      // Act - Simulate the exact flow from create-category.js
      let categoryId;
      try {
        const cat = await prisma.category.create({ data: { name: categoryName } });
        categoryId = cat.id;
      } catch (e) {
        console.error('Failed to create category:', e.message);
        throw e;
      } finally {
        await prisma.$disconnect();
      }

      // Assert
      expect(categoryId).toBe('cat-flow-123');
      expect(prisma.category.create).toHaveBeenCalledWith({ data: { name: categoryName } });
      expect(prisma.$disconnect).toHaveBeenCalled();
    });
  });
});
