package com.ISD.AIMS.dto;

import java.util.Set;

/**
 * Data Transfer Object for User information.
 * Used to safely transfer user data to the frontend without exposing sensitive information like passwords.
 */
public class UserDto {
    private Long id;
    private String username;
    private Set<String> roles;

    // Constructors
    public UserDto() {
    }

    public UserDto(Long id, String username, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
