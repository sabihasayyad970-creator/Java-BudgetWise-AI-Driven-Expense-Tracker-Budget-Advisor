package com.budgetwise.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.service.UserService;
import com.budgetwise.backend.security.JwtUtil;
import com.budgetwise.backend.dto.AuthResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ SIGNUP (FIXED: returns JSON instead of String)
    @PostMapping("/signup")
    public AuthResponse registerUser(@RequestBody User user) {

        String result = userService.signupUser(user);

        return new AuthResponse(result); // ✅ return JSON
    }

    // ✅ LOGIN (no change needed)
    @PostMapping("/login")
    public AuthResponse loginUser(@RequestBody User user) {

        User loggedUser = userService.authenticateUser(
                user.getEmail(),
                user.getPassword()
        );

        if (loggedUser != null) {

            String token = jwtUtil.generateToken(loggedUser.getEmail());

            return new AuthResponse(
                    token,
                    loggedUser.getId(),
                    loggedUser.getName(),
                    loggedUser.getEmail()
            );
        }

        return new AuthResponse("Invalid Login");
    }
}