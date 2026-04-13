package com.budgetwise.backend.controller;

import com.budgetwise.backend.dto.DashboardResponse;
import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.repository.*;
import com.budgetwise.backend.security.JwtUtil;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public DashboardController(IncomeRepository incomeRepository,
                               ExpenseRepository expenseRepository,
                               ProfileRepository profileRepository,
                               UserRepository userRepository,
                               JwtUtil jwtUtil) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public DashboardResponse getDashboard(@RequestHeader("Authorization") String token) {

        String email = jwtUtil.extractUsername(token.substring(7));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ USER-SPECIFIC DATA
        List<?> incomes = incomeRepository.findByUserId(user.getId());
        List<?> expenses = expenseRepository.findByUserId(user.getId());

        double totalIncome = incomes.stream()
                .mapToDouble(i -> ((com.budgetwise.backend.entity.Income) i).getAmount())
                .sum();

        double totalExpense = expenses.stream()
                .mapToDouble(e -> ((com.budgetwise.backend.entity.Expense) e).getAmount())
                .sum();

        var profile = profileRepository.findByUser_Id(user.getId()).orElse(null);

        Double savingsGoal = profile != null ? profile.getSavingsGoal() : 0.0;
        Double targetExpense = profile != null ? profile.getTargetExpense() : 0.0;

        return new DashboardResponse(totalIncome, totalExpense, savingsGoal, targetExpense);
    }
}