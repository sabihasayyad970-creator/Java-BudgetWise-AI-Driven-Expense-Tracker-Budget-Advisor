package com.budgetwise.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ SIGNUP
    public String signupUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists!";
        }

        userRepository.save(user);
        return "User registered successfully!";
    }

    // ✅ LOGIN
    public User authenticateUser(String email, String password) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }

        return null;
    }
}