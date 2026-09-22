package com.blog.repository;

import com.blog.entity.Blog;
import com.blog.entity.BlogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    Optional<Blog> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<Blog> findByStatus(BlogStatus status, Pageable pageable);

    Page<Blog> findByAuthorId(Long authorId, Pageable pageable);

    Page<Blog> findByAuthorIdAndStatus(Long authorId, BlogStatus status, Pageable pageable);

    Page<Blog> findByCategoryIdAndStatus(Long categoryId, BlogStatus status, Pageable pageable);

    @Query("SELECT b FROM Blog b JOIN b.tags t WHERE LOWER(t.name) = LOWER(:tagName) AND b.status = :status")
    Page<Blog> findByTagNameAndStatus(@Param("tagName") String tagName, @Param("status") BlogStatus status, Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.status = :status AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Blog> searchBlogs(@Param("keyword") String keyword, @Param("status") BlogStatus status, Pageable pageable);

    long countByStatus(BlogStatus status);
}
