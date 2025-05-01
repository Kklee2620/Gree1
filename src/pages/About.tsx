
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Giới thiệu</span>
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Chúng tôi cung cấp những sản phẩm tốt nhất cho khách hàng
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực thương mại điện tử, chúng tôi tự hào mang đến 
              cho khách hàng những sản phẩm chất lượng cao với giá cả hợp lý nhất.
            </p>
            <Button size="lg">Khám phá sản phẩm</Button>
          </div>
        </div>
        
        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Câu chuyện của chúng tôi</h2>
            <p className="text-gray-700 mb-4">
              Được thành lập vào năm 2015, ShopOnline bắt đầu từ một ý tưởng đơn giản: tạo ra một nền tảng mua sắm 
              trực tuyến đáng tin cậy, nơi khách hàng có thể tìm thấy những sản phẩm chất lượng với giá cả phải chăng.
            </p>
            <p className="text-gray-700 mb-4">
              Từ một cửa hàng nhỏ với chỉ vài sản phẩm, chúng tôi đã phát triển thành một trong những 
              website thương mại điện tử uy tín hàng đầu Việt Nam, phục vụ hàng trăm nghìn khách hàng mỗi tháng.
            </p>
            <p className="text-gray-700">
              Sứ mệnh của chúng tôi là đơn giản hóa trải nghiệm mua sắm trực tuyến và đảm bảo mỗi 
              khách hàng đều nhận được sản phẩm chất lượng cao nhất với dịch vụ chăm sóc khách hàng tuyệt vời.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=800&h=600" 
              alt="Đội ngũ của chúng tôi" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Giá trị cốt lõi</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Chất lượng</h3>
              <p className="text-gray-700">
                Chúng tôi cam kết cung cấp những sản phẩm có chất lượng cao nhất, được kiểm tra kỹ lưỡng 
                trước khi đến tay khách hàng.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Dịch vụ khách hàng</h3>
              <p className="text-gray-700">
                Chúng tôi luôn lắng nghe và hỗ trợ khách hàng một cách nhanh chóng, chuyên nghiệp và 
                hiệu quả nhất có thể.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Đổi mới</h3>
              <p className="text-gray-700">
                Chúng tôi không ngừng cải tiến và nâng cấp nền tảng mua sắm để mang lại trải nghiệm 
                tốt nhất cho khách hàng.
              </p>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Đội ngũ của chúng tôi</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Nguyễn Văn A",
                position: "Giám đốc điều hành",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400"
              },
              {
                name: "Trần Thị B",
                position: "Giám đốc Marketing",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400"
              },
              {
                name: "Phạm Văn C",
                position: "Trưởng bộ phận CSKH",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400"
              },
              {
                name: "Lê Thị D",
                position: "Quản lý sản phẩm",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400"
              }
            ].map((person, index) => (
              <div key={index} className="text-center">
                <div className="rounded-full overflow-hidden w-32 h-32 mx-auto mb-4">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h3 className="font-medium text-lg">{person.name}</h3>
                <p className="text-gray-500">{person.position}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-primary rounded-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Hãy bắt đầu mua sắm cùng chúng tôi</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Khám phá hàng ngàn sản phẩm chất lượng với giá cả phải chăng. Chúng tôi cam kết mang 
            đến cho bạn trải nghiệm mua sắm trực tuyến tốt nhất.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/products">Khám phá sản phẩm</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/20" asChild>
              <Link to="/contact">Liên hệ</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
