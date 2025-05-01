
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useShop } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { delay } from '@/lib/api';
import { ChevronRight, CreditCard, Truck, MapPin } from 'lucide-react';

// Định nghĩa các type cần thiết
type Address = {
  id?: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  description: string;
};

type ShippingMethod = {
  id: string;
  name: string;
  estimatedDelivery: string;
  fee: number;
};

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useShop();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: '',
    phoneNumber: '',
    street: '',
    ward: '',
    district: '',
    city: '',
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Tính toán đơn hàng
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = selectedShippingMethod 
    ? shippingMethods.find(m => m.id === selectedShippingMethod)?.fee || 0 
    : 0;
  const total = subtotal + shippingFee;
  
  useEffect(() => {
    // Kiểm tra nếu giỏ hàng trống, chuyển về trang chủ
    if (cart.items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    // Giả lập lấy dữ liệu
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        await delay(500);
        
        // Mock dữ liệu shipping method
        setShippingMethods([
          {
            id: 'standard',
            name: 'Giao hàng tiêu chuẩn',
            estimatedDelivery: '3-5 ngày',
            fee: 30000
          },
          {
            id: 'express',
            name: 'Giao hàng nhanh',
            estimatedDelivery: '1-2 ngày',
            fee: 50000
          },
          {
            id: 'same_day',
            name: 'Giao hàng trong ngày',
            estimatedDelivery: 'Trong ngày',
            fee: 100000
          }
        ]);
        
        // Mock dữ liệu payment method
        setPaymentMethods([
          {
            id: 'cod',
            name: 'Thanh toán khi nhận hàng (COD)',
            description: 'Thanh toán bằng tiền mặt khi nhận hàng'
          },
          {
            id: 'bank_transfer',
            name: 'Chuyển khoản ngân hàng',
            description: 'Chuyển khoản qua tài khoản ngân hàng của chúng tôi'
          },
          {
            id: 'credit_card',
            name: 'Thẻ tín dụng/ghi nợ',
            description: 'Thanh toán an toàn với thẻ VISA, Mastercard, JCB'
          }
        ]);
      } catch (error) {
        console.error('Error fetching checkout data:', error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu thanh toán. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [cart.items.length, toast, navigate]);
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng nhập lại
    if (addressErrors[name]) {
      setAddressErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateAddress = () => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingAddress.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    
    if (!shippingAddress.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[0-9]{9}$/.test(shippingAddress.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Vui lòng nhập địa chỉ chi tiết';
    }
    
    if (!shippingAddress.ward.trim()) {
      newErrors.ward = 'Vui lòng chọn phường/xã';
    }
    
    if (!shippingAddress.district.trim()) {
      newErrors.district = 'Vui lòng chọn quận/huyện';
    }
    
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    }
    
    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (step === 1 && !validateAddress()) {
      return;
    }
    
    if (step === 2 && !selectedShippingMethod) {
      toast({
        title: "Vui lòng chọn phương thức vận chuyển",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 3 && !selectedPaymentMethod) {
      toast({
        title: "Vui lòng chọn phương thức thanh toán",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmitOrder = async () => {
    setIsPlacingOrder(true);
    
    try {
      // Giả lập gọi API đặt hàng
      await delay(2000);
      
      // Xóa giỏ hàng
      clearCart();
      
      // Thông báo thành công
      toast({
        title: "Đặt hàng thành công",
        description: "Cảm ơn bạn đã mua sắm tại ShopOnline!",
      });
      
      // Chuyển hướng đến trang chi tiết đơn hàng hoặc trang cảm ơn
      navigate('/order-success');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Đặt hàng thất bại",
        description: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, name: 'Địa chỉ', icon: <MapPin size={16} /> },
      { number: 2, name: 'Vận chuyển', icon: <Truck size={16} /> },
      { number: 3, name: 'Thanh toán', icon: <CreditCard size={16} /> },
      { number: 4, name: 'Xác nhận', icon: <ChevronRight size={16} /> }
    ];
    
    return (
      <div className="flex justify-between mb-8">
        {steps.map((s) => (
          <div 
            key={s.number}
            className={`flex flex-col items-center w-1/4 ${
              s.number < step ? 'text-primary' : 
              s.number === step ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
              s.number < step ? 'bg-primary text-white' : 
              s.number === step ? 'border-2 border-primary text-primary' : 'border-2 border-gray-200'
            }`}>
              {s.number < step ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s.icon
              )}
            </div>
            <div className="text-sm font-medium">{s.name}</div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderAddressStep = () => {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Địa chỉ giao hàng</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleAddressChange}
              className={addressErrors.fullName ? "border-red-500" : ""}
            />
            {addressErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.fullName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={shippingAddress.phoneNumber}
              onChange={handleAddressChange}
              className={addressErrors.phoneNumber ? "border-red-500" : ""}
            />
            {addressErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.phoneNumber}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium mb-1">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </label>
            <Input
              id="street"
              name="street"
              value={shippingAddress.street}
              onChange={handleAddressChange}
              className={addressErrors.street ? "border-red-500" : ""}
              placeholder="Số nhà, tên đường, tòa nhà, v.v."
            />
            {addressErrors.street && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <Input
              id="city"
              name="city"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              className={addressErrors.city ? "border-red-500" : ""}
            />
            {addressErrors.city && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-1">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <Input
              id="district"
              name="district"
              value={shippingAddress.district}
              onChange={handleAddressChange}
              className={addressErrors.district ? "border-red-500" : ""}
            />
            {addressErrors.district && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.district}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="ward" className="block text-sm font-medium mb-1">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <Input
              id="ward"
              name="ward"
              value={shippingAddress.ward}
              onChange={handleAddressChange}
              className={addressErrors.ward ? "border-red-500" : ""}
            />
            {addressErrors.ward && (
              <p className="text-red-500 text-xs mt-1">{addressErrors.ward}</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderShippingStep = () => {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Phương thức vận chuyển</h3>
        
        {isLoading ? (
          <div className="text-center py-8">Đang tải phương thức vận chuyển...</div>
        ) : (
          <RadioGroup
            value={selectedShippingMethod}
            onValueChange={setSelectedShippingMethod}
            className="space-y-4"
          >
            {shippingMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center justify-between border p-4 rounded-lg ${
                  selectedShippingMethod === method.id ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start">
                  <RadioGroupItem value={method.id} id={`shipping-${method.id}`} className="mt-1" />
                  <div className="ml-3">
                    <Label htmlFor={`shipping-${method.id}`} className="text-base font-medium">
                      {method.name}
                    </Label>
                    <p className="text-gray-500 text-sm">
                      Thời gian dự kiến: {method.estimatedDelivery}
                    </p>
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(method.fee)}
                </div>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    );
  };
  
  const renderPaymentStep = () => {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
        
        {isLoading ? (
          <div className="text-center py-8">Đang tải phương thức thanh toán...</div>
        ) : (
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
            className="space-y-4"
          >
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center border p-4 rounded-lg ${
                  selectedPaymentMethod === method.id ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                <div className="ml-3">
                  <Label htmlFor={`payment-${method.id}`} className="text-base font-medium">
                    {method.name}
                  </Label>
                  <p className="text-gray-500 text-sm">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        )}
        
        <div className="mt-6">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Ghi chú đơn hàng (tùy chọn)
          </label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thông tin bổ sung cho đơn hàng của bạn, ví dụ: giao hàng giờ hành chính, gọi trước khi giao, v.v."
          />
        </div>
      </div>
    );
  };
  
  const renderConfirmStep = () => {
    const shippingMethod = shippingMethods.find(m => m.id === selectedShippingMethod);
    const paymentMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Xác nhận đơn hàng</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-2">Địa chỉ giao hàng</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p>{shippingAddress.phoneNumber}</p>
              <p>
                {shippingAddress.street}, {shippingAddress.ward}, {shippingAddress.district}, {shippingAddress.city}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-2">Phương thức vận chuyển</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{shippingMethod?.name}</p>
              <p className="text-gray-500 text-sm">
                Thời gian dự kiến: {shippingMethod?.estimatedDelivery}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-2">Phương thức thanh toán</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{paymentMethod?.name}</p>
            </div>
          </div>
          
          {notes && (
            <div>
              <h4 className="text-base font-medium mb-2">Ghi chú đơn hàng</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{notes}</p>
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-base font-medium mb-2">Sản phẩm trong giỏ hàng</h4>
            <div className="border rounded-lg divide-y">
              {cart.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium">{item.name}</h5>
                    {item.options && item.options.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {item.options.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.price)}</div>
                    <div className="text-sm text-gray-500">x {item.quantity}</div>
                    <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderAddressStep();
      case 2:
        return renderShippingStep();
      case 3:
        return renderPaymentStep();
      case 4:
        return renderConfirmStep();
      default:
        return null;
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
            <span>Thanh toán</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>
        
        {/* Step Indicator */}
        {renderStepIndicator()}
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Form Steps */}
            {renderCurrentStep()}
            
            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePreviousStep}>
                  Quay lại
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link to="/">Tiếp tục mua sắm</Link>
                </Button>
              )}
              
              {step < 4 ? (
                <Button onClick={handleNextStep}>
                  Tiếp tục
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h3 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.items.length} sản phẩm)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee > 0 ? formatCurrency(shippingFee) : 'Chưa tính'}</span>
                </div>
                <div className="border-t pt-3 font-medium flex justify-between">
                  <span>Tổng cộng</span>
                  <span className="text-primary text-lg">{formatCurrency(total)}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Đã bao gồm VAT (nếu có)
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
