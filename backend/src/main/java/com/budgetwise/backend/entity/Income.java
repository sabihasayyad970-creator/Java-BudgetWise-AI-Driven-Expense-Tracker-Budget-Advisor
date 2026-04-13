package com.budgetwise.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "income")
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String source;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Income() {}

    public Long getId() { return id; }
    public Double getAmount() { return amount; }
    public String getSource() { return source; }
    public LocalDate getDate() { return date; }
    public Long getUserId() { return userId; }

    public void setId(Long id) { this.id = id; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setSource(String source) { this.source = source; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setUserId(Long userId) { this.userId = userId; }
}