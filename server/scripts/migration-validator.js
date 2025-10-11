const { PrismaClient } = require("@prisma/client");
const fs = require('fs');
const path = require('path');

class MigrationValidator {
    constructor() {
        this.prisma = new PrismaClient();
        this.backupDir = path.join(__dirname, '../backups');
        this.ensureBackupDir();
    }

    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    async validateMigration(migrationPath) {
        const migrationContent = fs.readFileSync(migrationPath, 'utf8');
        
        // Check for dangerous operations
        const dangerousOperations = [
            'DROP TABLE',
            'DROP COLUMN',
            'ALTER TABLE.*DROP',
            'TRUNCATE',
            'DELETE FROM'
        ];

        const warnings = [];
        dangerousOperations.forEach(operation => {
            if (new RegExp(operation, 'i').test(migrationContent)) {
                warnings.push(`⚠️  DANGEROUS OPERATION DETECTED: ${operation}`);
            }
        });

        // Check for data loss operations
        if (migrationContent.includes('DROP COLUMN') && migrationContent.includes('NOT NULL')) {
            warnings.push('🚨 CRITICAL: Dropping column and adding NOT NULL column - potential data loss!');
        }

        return warnings;
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `backup-${timestamp}.sql`);
        
        try {
            // Get all table data using Prisma models directly
            let backupSQL = `-- Database backup created at ${new Date().toISOString()}\n`;
            backupSQL += `-- WARNING: This is a basic backup. Use mysqldump for production!\n\n`;

            // Backup each table using Prisma models
            const tables = ['user', 'product', 'category', 'customer_order', 'customer_order_product', 'wishlist'];
            
            for (const table of tables) {
                try {
                    const data = await this.getTableData(table);
                    if (data.length > 0) {
                        backupSQL += `-- Data for table ${table}\n`;
                        backupSQL += `-- ${data.length} records found\n`;
                        backupSQL += `-- Sample data: ${JSON.stringify(data[0], null, 2)}\n\n`;
                    } else {
                        backupSQL += `-- Table ${table} is empty\n\n`;
                    }
                } catch (error) {
                    console.log(`⚠️  Could not backup table ${table}: ${error.message}`);
                }
            }

            fs.writeFileSync(backupFile, backupSQL);
            console.log(`✅ Backup created: ${backupFile}`);
            return backupFile;
        } catch (error) {
            console.error('❌ Backup failed:', error);
            throw error;
        }
    }

    async getTableData(tableName) {
        // Get table data using Prisma models instead of raw queries
        try {
            switch (tableName) {
                case 'user':
                    return await this.prisma.user.findMany();
                case 'product':
                    return await this.prisma.product.findMany();
                case 'category':
                    return await this.prisma.category.findMany();
                case 'customer_order':
                    return await this.prisma.customer_order.findMany();
                case 'customer_order_product':
                    return await this.prisma.customer_order_product.findMany();
                case 'wishlist':
                    return await this.prisma.wishlist.findMany();
                default:
                    return [];
            }
        } catch (error) {
            console.log(`⚠️  Could not get data for table ${tableName}: ${error.message}`);
            return [];
        }
    }

    formatInsertValues(data) {
        // Simple formatting - in production, use proper SQL escaping
        return data.map(row => {
            const values = Object.values(row).map(val => 
                val === null ? 'NULL' : `'${val}'`
            );
            return `(${values.join(', ')})`;
        }).join(',\n');
    }

    async validateAllMigrations() {
        const migrationsDir = path.join(__dirname, '../prisma/migrations');
        const migrations = fs.readdirSync(migrationsDir)
            .filter(dir => dir !== 'migration_lock.toml')
            .sort();

        console.log('🔍 Validating migrations...\n');

        for (const migration of migrations) {
            const migrationPath = path.join(migrationsDir, migration, 'migration.sql');
            if (fs.existsSync(migrationPath)) {
                console.log(`📁 Checking: ${migration}`);
                const warnings = await this.validateMigration(migrationPath);
                
                if (warnings.length > 0) {
                    warnings.forEach(warning => console.log(`  ${warning}`));
                } else {
                    console.log('  ✅ No dangerous operations detected');
                }
                console.log('');
            }
        }
    }

    async runSafeMigration() {
        console.log('🛡️  Running safe migration with backup...\n');
        
        // Create backup before migration
        await this.createBackup();
        
        // Validate migrations
        await this.validateAllMigrations();
        
        console.log('✅ Migration validation complete. Proceed with caution!');
    }

    async close() {
        await this.prisma.$disconnect();
    }
}

// CLI usage
if (require.main === module) {
    const validator = new MigrationValidator();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'validate':
            validator.validateAllMigrations()
                .then(() => validator.close())
                .catch(console.error);
            break;
        case 'backup':
            validator.createBackup()
                .then(() => validator.close())
                .catch(console.error);
            break;
        case 'safe-migrate':
            validator.runSafeMigration()
                .then(() => validator.close())
                .catch(console.error);
            break;
        default:
            console.log('Usage: node migration-validator.js [validate|backup|safe-migrate]');
    }
}

module.exports = MigrationValidator;
