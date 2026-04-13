package com.budgetwise.backend.service;

import com.budgetwise.backend.entity.Budget;
import com.budgetwise.backend.repository.BudgetRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgetsByUser(String userEmail) {
        return budgetRepository.findByUserEmail(userEmail);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}