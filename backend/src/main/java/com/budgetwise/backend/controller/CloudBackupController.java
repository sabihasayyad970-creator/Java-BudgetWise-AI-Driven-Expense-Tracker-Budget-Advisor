package com.budgetwise.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.FileWriter;
import java.util.Map;

@RestController
@RequestMapping("/api/cloud")
@CrossOrigin(origins = "*")
public class CloudBackupController {

    @PostMapping("/backup")
    public ResponseEntity<?> backupData(@RequestBody Map<String, Object> data) {

        try {
            // Create backup folder if not exists
            File folder = new File("backup");
            if (!folder.exists()) {
                folder.mkdir();
            }

            // Create file
            File file = new File("backup/finance_backup.json");

            FileWriter writer = new FileWriter(file);
            writer.write(data.toString());
            writer.close();

            return ResponseEntity.ok("Backup saved successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Backup failed: " + e.getMessage());
        }
    }
}