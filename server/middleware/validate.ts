import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware để xác thực request với Zod schema
 * @param schema Schema Zod để xác thực
 * @param source Nguồn dữ liệu cần xác thực (body, query, params)
 */
export const validate = (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Xác thực dữ liệu từ nguồn được chỉ định
      const data = await schema.parseAsync(req[source]);
      // Gán dữ liệu đã được xác thực vào request
      req[source] = data;
      next();
    } catch (error) {
      // Xử lý lỗi xác thực từ Zod
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      
      // Các lỗi khác
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi xác thực dữ liệu',
        error: (error as Error).message
      });
    }
  };
}; 