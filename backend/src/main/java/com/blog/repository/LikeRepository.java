package com.blog.repository;

import com.blog.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndBlogId(Long userId, Long blogId);
    boolean existsByUserIdAndBlogId(Long userId, Long blogId);
    long countByBlogId(Long blogId);
    void deleteByUserIdAndBlogId(Long userId, Long blogId);
}
