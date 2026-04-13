package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.Profile;
import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.repository.ProfileRepository;
import com.budgetwise.backend.repository.UserRepository;
import com.budgetwise.backend.security.JwtUtil;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ProfileController(ProfileRepository profileRepository,
                             UserRepository userRepository,
                             JwtUtil jwtUtil) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // ✅ GET PROFILE
    @GetMapping
    public Profile getProfile(@RequestHeader("Authorization") String token) {

        String email = jwtUtil.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return profileRepository.findByUser_Id(user.getId()).orElse(null);
    }

    // ✅ UPDATE PROFILE
    @PostMapping
    public Profile saveProfile(@RequestBody Profile profile,
                              @RequestHeader("Authorization") String token) {

        String email = jwtUtil.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        profile.setUser(user);

        return profileRepository.save(profile);
    }
}