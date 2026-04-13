package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.Budget;
import com.budgetwise.backend.service.BudgetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // ✅ CREATE BUDGET (🔥 VERY IMPORTANT FIX)
    @PostMapping
    public Budget createBudget(
            @RequestBody Budget budget,
            @RequestParam String email
    ) {
        // 🔥 THIS LINE IS MOST IMPORTANT
        budget.setUserEmail(email);

        return budgetService.createBudget(budget);
    }

    // ✅ GET USER BUDGETS
    @GetMapping("/user/{email}")
    public List<Budget> getBudgetsByUser(@PathVariable String email) {
        return budgetService.getBudgetsByUser(email);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
    }
}