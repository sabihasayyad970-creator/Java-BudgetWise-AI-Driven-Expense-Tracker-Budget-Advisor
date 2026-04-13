package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.Expense;
import com.budgetwise.backend.repository.ExpenseRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // ✅ GET by userId
    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUserId(@PathVariable Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    // ✅ GET ALL (optional)
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // ✅ ADD EXPENSE
    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    // ✅ UPDATE EXPENSE
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,
                                @RequestBody Expense updatedExpense) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        if (updatedExpense.getTitle() != null) {
            expense.setTitle(updatedExpense.getTitle());
        }

        if (updatedExpense.getCategory() != null) {
            expense.setCategory(updatedExpense.getCategory());
        }

        if (updatedExpense.getAmount() != null) {
            expense.setAmount(updatedExpense.getAmount());
        }

        if (updatedExpense.getDate() != null) {
            expense.setDate(updatedExpense.getDate());
        }

        return expenseRepository.save(expense);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
    }
}