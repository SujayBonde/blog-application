package com.blog.controller;

import com.blog.dto.CommentRequest;
import com.blog.dto.CommentResponse;
import com.blog.entity.Role;
import com.blog.security.UserPrincipal;
import com.blog.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/blogs/{blogId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long blogId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return new ResponseEntity<>(
                commentService.addComment(blogId, request, principal.getId()),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/blogs/{blogId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long blogId) {
        return ResponseEntity.ok(commentService.getCommentsByBlogId(blogId));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_ADMIN.name()));
        commentService.deleteComment(id, principal.getId(), isAdmin);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
}
