package com.ISD.AIMS.controller;

import com.ISD.AIMS.dto.UserDto;
import com.ISD.AIMS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    /**
     * Lấy danh sách tất cả người dùng một cách an toàn bằng UserDto.
     * @return Danh sách UserDto (không chứa mật khẩu).
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.findAllUsersForAdmin();
        return ResponseEntity.ok(users);
    }

    /**
     * Vô hiệu hóa một tài khoản người dùng.
     * @param id ID của người dùng.
     * @return Thông báo thành công.
     */
    @PutMapping("/users/{id}/disable")
    public ResponseEntity<?> disableUser(@PathVariable Long id) {
        userService.disableUser(id);
        return ResponseEntity.ok("User disabled successfully.");
    }

    /**
     * Kích hoạt lại một tài khoản người dùng.
     * @param id ID của người dùng.
     * @return Thông báo thành công.
     */
    @PutMapping("/users/{id}/enable")
    public ResponseEntity<?> enableUser(@PathVariable Long id) {
        userService.enableUser(id);
        return ResponseEntity.ok("User enabled successfully.");
    }

    /**
     * Đặt lại mật khẩu của người dùng về giá trị mặc định.
     * @param id ID của người dùng.
     * @return Thông báo thành công.
     */
    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id) {
        userService.resetPasswordToDefault(id);
        return ResponseEntity.ok("Password has been reset to default.");
    }

    /**
     * Cập nhật vai trò cho một người dùng.
     * @param id ID của người dùng.
     * @param roles Một Set các vai trò mới (ví dụ: ["USER", "ADMIN"]).
     * @return Thông báo thành công.
     */
    @PutMapping("/users/{id}/roles")
    public ResponseEntity<?> updateRoles(@PathVariable Long id, @RequestBody Set<String> roles) {
        userService.updateRoles(id, roles);
        return ResponseEntity.ok("Roles updated successfully.");
    }
}
