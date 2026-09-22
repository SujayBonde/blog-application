package com.blog.controller;

import com.blog.dto.DashboardStatsResponse;
import com.blog.dto.PagedResponse;
import com.blog.dto.UserDto;
import com.blog.service.AdminService;
import com.blog.service.BlogService;
import com.blog.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final BlogService blogService;
    private final CommentService commentService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<Map<String, String>> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id, null, true);
        return ResponseEntity.ok(Map.of("message", "Blog deleted successfully by admin"));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id, null, true);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully by admin"));
    }
}
