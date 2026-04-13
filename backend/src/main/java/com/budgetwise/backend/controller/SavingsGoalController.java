package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.SavingsGoal;
import com.budgetwise.backend.repository.SavingsGoalRepository;
import com.budgetwise.backend.repository.UserRepository;
import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.security.JwtUtil;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "*")
public class SavingsGoalController {

    private final SavingsGoalRepository repository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public SavingsGoalController(SavingsGoalRepository repository,
                                 UserRepository userRepository,
                                 JwtUtil jwtUtil) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // ✅ CREATE (SECURE)
    @PostMapping
    public SavingsGoal create(@RequestBody SavingsGoal goal,
                              @RequestHeader("Authorization") String token) {

        String email = jwtUtil.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        goal.setUserId(user.getId()); // ✅ FORCE USER

        return repository.save(goal);
    }

    // ✅ GET USER-SPECIFIC
    @GetMapping("/user/{userId}")
    public List<SavingsGoal> getByUser(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public SavingsGoal update(@PathVariable Long id,
                              @RequestBody SavingsGoal updated,
                              @RequestHeader("Authorization") String token) {

        SavingsGoal goal = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (updated.getGoalName() != null) {
            goal.setGoalName(updated.getGoalName());
        }

        goal.setTargetAmount(updated.getTargetAmount());
        goal.setSavedAmount(updated.getSavedAmount());

        return repository.save(goal);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}