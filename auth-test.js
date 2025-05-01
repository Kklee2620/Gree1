require('dotenv').config();

const API_URL = 'http://localhost:3001';

// Hàm delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAuth() {
  try {
    console.log('Kiểm tra trạng thái API...');
    const statusResponse = await fetch(`${API_URL}/api/status`);
    const statusData = await statusResponse.json();
    console.log('API Status:', statusData);
    
    // Thêm delay để đảm bảo server hoạt động đầy đủ
    console.log('Đợi 2 giây để đảm bảo server khởi động hoàn tất...');
    await delay(2000);

    console.log('\nĐăng nhập với tài khoản admin...');
    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'Admin123'
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('Lỗi đăng nhập:', loginResponse.status, errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('Đăng nhập thành công:', loginData.message);
    console.log('Thông tin người dùng:', {
      id: loginData.user.id,
      name: loginData.user.name,
      email: loginData.user.email,
      role: loginData.user.role
    });

    // Lưu token để sử dụng cho các request khác
    const token = loginData.token;

    console.log('\nLấy danh sách người dùng (yêu cầu quyền admin)...');
    const usersResponse = await fetch(`${API_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!usersResponse.ok) {
      const errorText = await usersResponse.text();
      console.error('Lỗi lấy danh sách người dùng:', usersResponse.status, errorText);
      return;
    }

    const usersData = await usersResponse.json();
    console.log('Số lượng người dùng:', usersData.users.length);
    console.log('Danh sách người dùng:', usersData.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })));

  } catch (error) {
    console.error('Lỗi thực thi test:', error);
  }
}

testAuth(); 