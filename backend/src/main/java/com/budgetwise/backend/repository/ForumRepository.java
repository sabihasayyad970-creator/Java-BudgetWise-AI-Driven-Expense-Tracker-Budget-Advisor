package com.budgetwise.backend.repository;

import com.budgetwise.backend.entity.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumRepository extends JpaRepository<ForumPost, Long> {

    List<ForumPost> findByUserId(Long userId);
}