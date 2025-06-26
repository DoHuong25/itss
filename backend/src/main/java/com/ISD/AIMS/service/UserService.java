package com.ISD.AIMS.service;

import com.ISD.AIMS.dto.UserDto;
import com.ISD.AIMS.model.User;
import com.ISD.AIMS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy; // 1. Thêm import @Lazy
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 2. [THAY ĐỔI QUAN TRỌNG]
     * Thêm @Lazy vào PasswordEncoder để phá vỡ vòng lặp tham chiếu.
     * Spring sẽ không tạo PasswordEncoder ngay lập tức, mà chỉ khi nó thực sự được dùng.
     */
    @Autowired
    public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }

    public boolean register(String username, String rawPassword, Set<String> roles) {
        if (userRepository.existsByUsername(username)) {
            return false;
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRoles((roles == null || roles.isEmpty()) ? defaultRoles() : roles);
        user.setEnabled(true);
        userRepository.save(user);
        return true;
    }

    private HashSet<String> defaultRoles() {
        HashSet<String> set = new HashSet<>();
        set.add("USER");
        return set;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void disableUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setEnabled(false);
            userRepository.save(user);
        });
    }

    public void enableUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setEnabled(true);
            userRepository.save(user);
        });
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public void resetPasswordToDefault(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode("123456"));
            userRepository.save(user);
        });
    }

    public void updateRoles(Long id, Set<String> roles) {
        userRepository.findById(id).ifPresent(user -> {
            user.setRoles(roles);
            userRepository.save(user);
        });
    }

    public List<UserDto> findAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getRoles()
        );
    }
}
