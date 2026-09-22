package com.blog.dto;

import com.blog.entity.BlogStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogResponse {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String summary;
    private String thumbnail;
    private BlogStatus status;
    private UserDto author;
    private CategoryDto category;
    private Set<TagDto> tags;
    private long likesCount;
    private long commentsCount;
    private boolean likedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
