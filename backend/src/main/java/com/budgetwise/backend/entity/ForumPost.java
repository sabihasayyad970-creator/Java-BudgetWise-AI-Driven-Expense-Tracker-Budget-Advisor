package com.budgetwise.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "forum_posts")
public class ForumPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private int likes = 0;

    @ElementCollection
    private List<String> comments = new ArrayList<>();

    @Column(name = "user_id")
    private Long userId;

    public ForumPost() {}

    public Long getId() { return id; }
    public String getContent() { return content; }
    public int getLikes() { return likes; }
    public List<String> getComments() { return comments; }
    public Long getUserId() { return userId; }

    public void setId(Long id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setLikes(int likes) { this.likes = likes; }
    public void setComments(List<String> comments) { this.comments = comments; }
    public void setUserId(Long userId) { this.userId = userId; }
}