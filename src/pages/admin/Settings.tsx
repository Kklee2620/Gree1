import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';

interface SystemSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  maintenanceMode: boolean;
  enableReviews: boolean;
  enableMultiLang: boolean;
}

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<SystemSettings>({
    storeName: 'Cửa hàng của tôi',
    storeEmail: 'contact@example.com',
    storePhone: '0123456789',
    storeAddress: '123 Đường ABC, Quận 1, TP.HCM',
    maintenanceMode: false,
    enableReviews: true,
    enableMultiLang: false
  });

  // Fetch settings with React Query
  const { data: initialSettings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      // Gọi API thực tế để lấy settings
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu settings');
      return res.json();
    },
    onSuccess: (data) => {
      if (data) setSettings(data);
    }
  });

  // Mutation for saving settings
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: SystemSettings) => {
      // Gọi API thực tế để cập nhật settings
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) throw new Error('Lỗi khi lưu cài đặt');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Lưu cài đặt thành công",
        description: "Các cài đặt hệ thống đã được cập nhật."
      });
    },
    onError: () => {
      toast({
        title: "Lỗi khi lưu cài đặt",
        description: "Đã xảy ra lỗi khi lưu cài đặt. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Cấu hình hệ thống</h1>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={saveSettingsMutation.isPending}
          >
            {saveSettingsMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu cài đặt
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Thông tin cửa hàng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tên cửa hàng</Label>
                  <Input 
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Email liên hệ</Label>
                  <Input 
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input 
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Địa chỉ</Label>
                  <Input 
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({...settings, storeAddress: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold">Tính năng hệ thống</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chế độ bảo trì</Label>
                    <p className="text-sm text-gray-500">
                      Tạm dừng hoạt động cửa hàng để bảo trì
                    </p>
                  </div>
                  <Switch 
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cho phép đánh giá</Label>
                    <p className="text-sm text-gray-500">
                      Cho phép khách hàng đánh giá sản phẩm
                    </p>
                  </div>
                  <Switch 
                    checked={settings.enableReviews}
                    onCheckedChange={(checked) => setSettings({...settings, enableReviews: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Đa ngôn ngữ</Label>
                    <p className="text-sm text-gray-500">
                      Bật tính năng đa ngôn ngữ cho cửa hàng
                    </p>
                  </div>
                  <Switch 
                    checked={settings.enableMultiLang}
                    onCheckedChange={(checked) => setSettings({...settings, enableMultiLang: checked})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;