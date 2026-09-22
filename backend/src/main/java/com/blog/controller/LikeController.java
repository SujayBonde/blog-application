package com.blog.controller;

import com.blog.security.UserPrincipal;
import com.blog.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/blogs/{blogId}")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long blogId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(likeService.toggleLike(blogId, principal.getId()));
    }

    @GetMapping("/like-status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @PathVariable Long blogId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(likeService.getLikeStatus(blogId, userId));
    }
}
