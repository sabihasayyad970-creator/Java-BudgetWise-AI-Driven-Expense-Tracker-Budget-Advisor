package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.ForumPost;
import com.budgetwise.backend.repository.ForumRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "*")
public class ForumController {

    private final ForumRepository forumRepository;

    public ForumController(ForumRepository forumRepository) {
        this.forumRepository = forumRepository;
    }

    // ✅ GET USER POSTS
    @GetMapping("/user/{userId}")
    public List<ForumPost> getPosts(@PathVariable Long userId) {
        return forumRepository.findByUserId(userId);
    }

    // ✅ CREATE POST
    @PostMapping
    public ForumPost createPost(@RequestBody ForumPost post) {
        return forumRepository.save(post);
    }

    // ✅ LIKE POST
    @PutMapping("/like/{id}")
    public ForumPost likePost(@PathVariable Long id) {
        ForumPost post = forumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setLikes(post.getLikes() + 1);
        return forumRepository.save(post);
    }

    // ✅ ADD COMMENT
    @PutMapping("/comment/{id}")
    public ForumPost addComment(@PathVariable Long id,
                               @RequestBody String comment) {

        ForumPost post = forumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getComments().add(comment);
        return forumRepository.save(post);
    }
}