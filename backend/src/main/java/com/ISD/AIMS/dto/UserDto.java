package com.ISD.AIMS.dto;

import java.util.Set;

public class UserDto {
    private Long id;
    private String username;
    private Set<String> roles;
    private boolean enabled; // <-- THÊM DÒNG NÀY

    // Constructors
    public UserDto() {
    }

    // Cập nhật constructor để bao gồm 'enabled'
    public UserDto(Long id, String username, Set<String> roles, boolean enabled) { // <-- SỬA DÒNG NÀY
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.enabled = enabled; // <-- THÊM DÒNG NÀY
    }

    // Getters and Setters (giữ nguyên các getter/setter cũ)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    // THÊM GETTER/SETTER CHO TRƯỜNG MỚI
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}