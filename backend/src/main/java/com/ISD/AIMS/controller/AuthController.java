package com.ISD.AIMS.controller;

import com.ISD.AIMS.model.User;
import com.ISD.AIMS.security.JwtUtil;
import com.ISD.AIMS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Không cần dùng PasswordEncoder trực tiếp trong hàm login nữa
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // **THAY ĐỔI 1: Thêm AuthenticationManager**
    // Đây là công cụ xác thực tiêu chuẩn của Spring Security.
    @Autowired
    private AuthenticationManager authenticationManager;

    // Giữ nguyên các lớp Request của bạn
    public static class RegisterRequest {
        public String username;
        public String password;
        public Set<String> roles;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    // Giữ nguyên hàm register của bạn
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        boolean created = userService.register(
                request.username,
                request.password,
                request.roles
        );

        if (!created) {
            return ResponseEntity
                    .badRequest()
                    .body("Username already exists.");
        }

        return ResponseEntity.ok("User registered successfully.");
    }

    // **THAY ĐỔI 2: Cập nhật hàm login để sử dụng AuthenticationManager**
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Spring Security sẽ tự động dùng UserService và PasswordEncoder để xác thực
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username, request.password)
            );

            // Nếu xác thực thành công, lấy thông tin User
            Optional<User> userOpt = userService.findByUsername(request.username);
            if (userOpt.isEmpty()) {
                // Trường hợp này gần như không thể xảy ra nếu xác thực thành công
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
            }
            User user = userOpt.get();

            // Vẫn giữ nguyên logic kiểm tra tài khoản bị vô hiệu hóa của bạn
            if (!user.isEnabled()) {
                return ResponseEntity.status(403).body("Account is disabled");
            }

            // Tạo token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());

            // Trả về response với định dạng giống hệt của bạn
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", user.getUsername(),
                    "roles", user.getRoles()
            ));

        } catch (BadCredentialsException e) {
            // Bắt lỗi nếu tên đăng nhập hoặc mật khẩu không đúng
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
