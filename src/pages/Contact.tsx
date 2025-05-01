import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight } from 'lucide-react';
import { delay } from '@/lib/api';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu sửa
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Họ tên không được vượt quá 50 ký tự';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Phone validation
    if (formData.phone && !/^(0|\+84)[0-9]{9,12}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 9-12 chữ số và bắt đầu bằng 0 hoặc +84';
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tiêu đề';
    } else if (formData.subject.trim().length > 100) {
      newErrors.subject = 'Tiêu đề không được vượt quá 100 ký tự';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung liên hệ';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Nội dung liên hệ quá ngắn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Giả lập gọi API
      await delay(1000);
      
      // Đặt lại form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Hiển thị thông báo thành công
      toast({
        title: "Gửi liên hệ thành công",
        description: "Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Lỗi gửi liên hệ",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Liên hệ</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Liên hệ với chúng tôi</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Địa chỉ</h3>
                <address className="not-italic text-gray-600">
                  74 đường số 13, Phường Bình Trị Đông B<br />
                  Quận Bình Tân, TP.HCM
                </address>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Liên hệ</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Email: support@yapee.com</p>
                  <p>Hotline: 0333.938.014</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Giờ làm việc</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Thứ 2 - Thứ 7: 8:00 - 19:00</p>
                  <p>Chủ nhật: Nghỉ</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(social => (
                    <a 
                      key={social} 
                      href="#" 
                      className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      {social[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Số điện thoại
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? "border-red-500" : ""}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Google Map */}
        <div className="mb-8 rounded-lg overflow-hidden h-96">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.7855300109855!2d106.58922611039033!3d10.750341189359056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752d004d391bcd%3A0x37f97ef7a4e80380!2zNzQgxJDGsOG7nW5nIDEzLCBCw6xuaCBUcuG7iyDEkMO0bmcgQiwgQsOsbmggVMOibiwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1653649469843!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
