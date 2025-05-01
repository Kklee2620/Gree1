/**
 * Chuyển đổi chuỗi thành slug URL
 * @param text Chuỗi cần chuyển đổi
 * @returns Chuỗi slug
 */
export default function slugify(text: string): string {
  // Chuyển về chữ thường
  let slug = text.toLowerCase();
  
  // Xử lý các ký tự tiếng Việt
  slug = slug
    .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd');
  
  // Xóa các ký tự đặc biệt
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  
  // Chuyển khoảng trắng thành dấu gạch ngang
  slug = slug.replace(/[\s_]+/g, '-');
  
  // Xóa các ký tự gạch ngang liên tiếp
  slug = slug.replace(/-+/g, '-');
  
  // Xóa gạch ngang ở đầu và cuối
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
} 