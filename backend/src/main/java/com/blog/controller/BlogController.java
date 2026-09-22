package com.blog.controller;

import com.blog.dto.BlogRequest;
import com.blog.dto.BlogResponse;
import com.blog.dto.PagedResponse;
import com.blog.entity.BlogStatus;
import com.blog.entity.Role;
import com.blog.security.UserPrincipal;
import com.blog.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @PostMapping
    public ResponseEntity<BlogResponse> createBlog(
            @Valid @RequestBody BlogRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return new ResponseEntity<>(blogService.createBlog(request, principal.getId()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<BlogResponse>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) BlogStatus status
    ) {
        return ResponseEntity.ok(blogService.getAllBlogs(
                page, size, sortBy, sortDir, categoryId, tag, keyword, authorId, status
        ));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<BlogResponse>> searchBlogs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(blogService.getAllBlogs(
                page, size, sortBy, sortDir, null, null, keyword, null, BlogStatus.PUBLISHED
        ));
    }

    @GetMapping("/my-blogs")
    public ResponseEntity<PagedResponse<BlogResponse>> getMyBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) BlogStatus status,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(blogService.getAllBlogs(
                page, size, "createdAt", "desc", null, null, null, principal.getId(), status
        ));
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogResponse> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogResponse> updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody BlogRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_ADMIN.name()));
        return ResponseEntity.ok(blogService.updateBlog(id, request, principal.getId(), isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBlog(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_ADMIN.name()));
        blogService.deleteBlog(id, principal.getId(), isAdmin);
        return ResponseEntity.ok(Map.of("message", "Blog post deleted successfully"));
    }
}
