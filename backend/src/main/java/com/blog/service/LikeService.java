package com.blog.service;

import com.blog.entity.Blog;
import com.blog.entity.Like;
import com.blog.entity.User;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.BlogRepository;
import com.blog.repository.LikeRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Transactional
    public Map<String, Object> toggleLike(Long blogId, Long userId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", blogId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<Like> existingLike = likeRepository.findByUserIdAndBlogId(userId, blogId);
        boolean liked;

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            liked = false;
        } else {
            Like newLike = Like.builder()
                    .blog(blog)
                    .user(user)
                    .build();
            likeRepository.save(newLike);
            liked = true;
        }

        long count = likeRepository.countByBlogId(blogId);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", liked);
        response.put("likesCount", count);
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getLikeStatus(Long blogId, Long userId) {
        if (!blogRepository.existsById(blogId)) {
            throw new ResourceNotFoundException("Blog", "id", blogId);
        }

        boolean liked = false;
        if (userId != null) {
            liked = likeRepository.existsByUserIdAndBlogId(userId, blogId);
        }
        long count = likeRepository.countByBlogId(blogId);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", liked);
        response.put("likesCount", count);
        return response;
    }
}
