package com.budgetwise.backend.dto;

public class AuthResponse {

    private String message;   // ✅ ADD THIS
    private String token;
    private Long id;
    private String name;
    private String email;

    public AuthResponse() {}

    // ✅ LOGIN RESPONSE
    public AuthResponse(String token, Long id, String name, String email) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // ✅ SIGNUP RESPONSE
    public AuthResponse(String message) {
        this.message = message;
    }

    // ✅ GETTERS
    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}