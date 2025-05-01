import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { validate as classValidate } from 'class-validator';

/**
 * Middleware để validate request body dựa trên schema
 * @param schema Schema dùng để validate
 * @returns Express middleware
 */
export const validate = <T extends object>(schema: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Chuyển đổi plain object sang class instance
      const instance = plainToClass(schema, req.body);
      
      // Validate instance
      const errors = await classValidate(instance);
      
      if (errors.length > 0) {
        // Format lỗi dễ đọc
        const formattedErrors = formatValidationErrors(errors);
        
        return res.status(400).json({
          message: 'Dữ liệu không hợp lệ',
          errors: formattedErrors
        });
      }
      
      // Nếu hợp lệ, tiếp tục
      next();
    } catch (error) {
      console.error('Lỗi khi validate:', error);
      res.status(500).json({ 
        message: 'Lỗi server khi validate dữ liệu',
        error: error.message
      });
    }
  };
};

/**
 * Format lỗi validation từ class-validator thành đối tượng dễ đọc
 * @param errors Mảng lỗi từ class-validator
 * @returns Object với key là tên field, value là mảng lỗi
 */
function formatValidationErrors(errors: ValidationError[]) {
  const result: Record<string, string[]> = {};
  
  for (const error of errors) {
    const field = error.property;
    const constraints = error.constraints || {};
    
    result[field] = Object.values(constraints);
    
    // Xử lý lỗi con nếu có
    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children);
      
      // Thêm prefix trường cha cho key con
      for (const [childField, childMessages] of Object.entries(childErrors)) {
        result[`${field}.${childField}`] = childMessages;
      }
    }
  }
  
  return result;
}

// Hàm validate đơn giản không dùng middleware
export const validateObject = async <T extends object>(data: object, schema: new () => T) => {
  const instance = plainToClass(schema, data);
  const errors = await classValidate(instance);
  
  if (errors.length > 0) {
    return {
      valid: false,
      errors: formatValidationErrors(errors)
    };
  }
  
  return {
    valid: true,
    data: instance
  };
}; 