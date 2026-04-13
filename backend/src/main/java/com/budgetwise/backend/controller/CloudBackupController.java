package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.repository.UserRepository;
import com.budgetwise.backend.security.JwtUtil;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.FileWriter;
import java.util.Map;

@RestController
@RequestMapping("/api/cloud")
@CrossOrigin(origins = "*")
public class CloudBackupController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public CloudBackupController(UserRepository userRepository,
                                 JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/backup")
    public ResponseEntity<?> backupData(@RequestBody Map<String, Object> data,
                                        @RequestHeader("Authorization") String token) {

        try {
            String email = jwtUtil.extractUsername(token.substring(7));

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            File folder = new File("backup");
            if (!folder.exists()) folder.mkdir();

            // ✅ USER-SPECIFIC FILE
            File file = new File("backup/finance_backup_" + user.getId() + ".json");

            FileWriter writer = new FileWriter(file);
            writer.write(data.toString());
            writer.close();

            return ResponseEntity.ok("Backup saved successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Backup failed: " + e.getMessage());
        }
    }
}