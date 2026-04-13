package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.Income;
import com.budgetwise.backend.repository.IncomeRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "*")
public class IncomeController {

    private final IncomeRepository incomeRepository;

    public IncomeController(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    // ✅ GET by userId
    @GetMapping("/user/{userId}")
    public List<Income> getIncomeByUserId(@PathVariable Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    // ✅ POST (ADD)
    @PostMapping
    public Income createIncome(@RequestBody Income income) {
        return incomeRepository.save(income);
    }

    // ✅ PUT (UPDATE) — FINAL FIX
    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id,
                               @RequestBody Income updatedIncome) {

        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found with id: " + id));

        // ✅ Update fields
        income.setSource(updatedIncome.getSource());
        income.setAmount(updatedIncome.getAmount());
        income.setDate(updatedIncome.getDate());

        // ✅ VERY IMPORTANT: KEEP OLD userId (DO NOT REMOVE)
        // No need to set userId again — it stays same

        return incomeRepository.save(income);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeRepository.deleteById(id);
    }
}