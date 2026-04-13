package com.budgetwise.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "savings_goal")
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String goalName;
    private Double targetAmount;
    private Double savedAmount;

    // ✅ NEW FIELD
    private Long userId;

    public SavingsGoal() {}

    public Long getId() { return id; }

    public String getGoalName() { return goalName; }

    public Double getTargetAmount() { return targetAmount; }

    public Double getSavedAmount() { return savedAmount; }

    public Long getUserId() { return userId; } // ✅ NEW

    public void setId(Long id) { this.id = id; }

    public void setGoalName(String goalName) { this.goalName = goalName; }

    public void setTargetAmount(Double targetAmount) { this.targetAmount = targetAmount; }

    public void setSavedAmount(Double savedAmount) { this.savedAmount = savedAmount; }

    public void setUserId(Long userId) { this.userId = userId; } // ✅ NEW
}