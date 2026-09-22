package com.blog.service;

import com.blog.dto.DashboardStatsResponse;
import com.blog.dto.PagedResponse;
import com.blog.dto.UserDto;
import com.blog.entity.BlogStatus;
import com.blog.entity.User;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final CategoryRepository categoryRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalBlogs = blogRepository.count();
        long publishedBlogs = blogRepository.countByStatus(BlogStatus.PUBLISHED);
        long draftBlogs = blogRepository.countByStatus(BlogStatus.DRAFT);
        long totalComments = commentRepository.count();
        long totalLikes = likeRepository.count();
        long totalCategories = categoryRepository.count();

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalBlogs(totalBlogs)
                .publishedBlogs(publishedBlogs)
                .draftBlogs(draftBlogs)
                .totalComments(totalComments)
                .totalLikes(totalLikes)
                .totalCategories(totalCategories)
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDto> getAllUsers(int page, int size) {
        Page<User> userPage = userRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );

        return PagedResponse.<UserDto>builder()
                .content(userPage.getContent().stream()
                        .map(authService::mapToDto)
                        .collect(Collectors.toList()))
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }
}
