import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const apiClient = axios.create({
    // URL gốc của backend Spring Boot
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
 * --- INTERCEPTOR (BỘ CAN THIỆP) ĐÃ ĐƯỢC KÍCH HOẠT ---
 *
 * Đoạn code này sẽ được thực thi TRƯỚC MỖI REQUEST được gửi đi.
 * Nó sẽ tự động lấy token từ localStorage và đính kèm vào header 'Authorization'.
 * Điều này đảm bảo mọi yêu cầu gửi từ apiClient đều đã được xác thực.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (hoặc nơi bạn lưu trữ nó sau khi đăng nhập)
        const token = localStorage.getItem('token');
        
        if (token) {
            // Nếu có token, thêm nó vào header Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config; // Trả về config đã được sửa đổi để axios tiếp tục gửi request
    },
    (error) => {
        // Xử lý lỗi nếu có
        return Promise.reject(error);
    }
);

export default apiClient;