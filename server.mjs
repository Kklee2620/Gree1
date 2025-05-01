import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Thiết lập biến môi trường
process.env.NODE_ENV = 'development';

// Tạo __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tạo require cho ESM
const require = createRequire(import.meta.url);

// Đăng ký ts-node
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS'
  }
});

// Khởi động server
console.log('Đang khởi động server...');
require('./server/index.ts'); 