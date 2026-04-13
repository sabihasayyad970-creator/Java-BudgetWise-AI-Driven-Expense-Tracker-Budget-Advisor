package com.budgetwise.backend.service;

import com.budgetwise.backend.entity.SavingsGoal;
import com.budgetwise.backend.repository.SavingsGoalRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository repository;

    public SavingsGoalService(SavingsGoalRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public SavingsGoal createGoal(SavingsGoal goal) {
        return repository.save(goal);
    }

    // GET ALL
    public List<SavingsGoal> getAllGoals() {
        return repository.findAll();
    }

    // UPDATE
    public SavingsGoal updateGoal(Long id, SavingsGoal updatedGoal) {
        SavingsGoal goal = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (updatedGoal.getGoalName() != null) {
            goal.setGoalName(updatedGoal.getGoalName());
        }

        goal.setTargetAmount(updatedGoal.getTargetAmount());
        goal.setSavedAmount(updatedGoal.getSavedAmount());

        return repository.save(goal);
    }

    // DELETE
    public void deleteGoal(Long id) {
        repository.deleteById(id);
    }
}