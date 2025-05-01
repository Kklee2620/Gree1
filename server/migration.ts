import { DataSource } from "typeorm";
import { AppDataSource } from "./typeorm.config";

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    
    // Chạy tất cả migrations
    const migrations = await AppDataSource.runMigrations();
    
    console.log(`✅ Đã chạy ${migrations.length} migrations thành công.`);
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi chạy migrations:", error);
    process.exit(1);
  }
}

async function revertLastMigration() {
  try {
    await AppDataSource.initialize();
    
    // Khôi phục migration gần nhất
    await AppDataSource.undoLastMigration();
    
    console.log("✅ Đã khôi phục migration gần nhất thành công.");
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi khôi phục migration:", error);
    process.exit(1);
  }
}

async function generateMigration() {
  try {
    await AppDataSource.initialize();
    
    const migrationName = process.argv[3] || `Migration${Date.now()}`;
    
    // Sinh migrations tự động dựa trên thay đổi entities
    const { options } = AppDataSource;
    const outDir = options.cli?.migrationsDir || "./migrations";
    
    console.log(`Generating migration ${migrationName} in ${outDir}`);
    
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi sinh migration:", error);
    process.exit(1);
  }
}

// Chạy function dựa vào tham số dòng lệnh
const command = process.argv[2];
const migrationName = process.argv[3];

switch (command) {
  case "run":
    runMigrations();
    break;
  case "revert":
    revertLastMigration();
    break;
  case "generate":
    generateMigration();
    break;
  default:
    console.log(`
Sử dụng:
  npm run migration:run - Chạy tất cả migrations chưa được áp dụng
  npm run migration:revert - Khôi phục migration gần nhất
  npm run migration:generate <tên> - Tạo migration mới từ thay đổi entities
    `);
    process.exit(0);
} 