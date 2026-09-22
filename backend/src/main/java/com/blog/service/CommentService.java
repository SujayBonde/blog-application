package com.blog.service;

import com.blog.dto.CommentRequest;
import com.blog.dto.CommentResponse;
import com.blog.entity.Blog;
import com.blog.entity.Comment;
import com.blog.entity.User;
import com.blog.exception.ResourceNotFoundException;
import com.blog.exception.UnauthorizedException;
import com.blog.repository.BlogRepository;
import com.blog.repository.CommentRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional
    public CommentResponse addComment(Long blogId, CommentRequest request, Long userId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", blogId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Comment comment = Comment.builder()
                .content(request.getContent().trim())
                .blog(blog)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBlogId(Long blogId) {
        if (!blogRepository.existsById(blogId)) {
            throw new ResourceNotFoundException("Blog", "id", blogId);
        }

        return commentRepository.findByBlogIdOrderByCreatedAtDesc(blogId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, Long currentUserId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        // Allow comment deletion if the user is the comment author, blog author, or admin
        boolean isCommentAuthor = comment.getUser().getId().equals(currentUserId);
        boolean isBlogAuthor = comment.getBlog().getAuthor().getId().equals(currentUserId);

        if (!isAdmin && !isCommentAuthor && !isBlogAuthor) {
            throw new UnauthorizedException("You do not have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToDto(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(authService.mapToDto(comment.getUser()))
                .blogId(comment.getBlog().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
