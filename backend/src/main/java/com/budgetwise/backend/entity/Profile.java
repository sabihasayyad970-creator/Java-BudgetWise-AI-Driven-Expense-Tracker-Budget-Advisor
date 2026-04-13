package com.budgetwise.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;
    private String photo;

    private Double savingsGoal;
    private Double targetExpense;

    // ✅ FIXED (important)
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // ===== GETTERS =====
    public Long getId() { return id; }

    public String getPhone() { return phone; }
    public String getPhoto() { return photo; }

    public Double getSavingsGoal() { return savingsGoal; }
    public Double getTargetExpense() { return targetExpense; }

    public User getUser() { return user; }

    // ===== SETTERS =====
    public void setPhone(String phone) { this.phone = phone; }
    public void setPhoto(String photo) { this.photo = photo; }

    public void setSavingsGoal(Double savingsGoal) { this.savingsGoal = savingsGoal; }
    public void setTargetExpense(Double targetExpense) { this.targetExpense = targetExpense; }

    public void setUser(User user) { this.user = user; }
}