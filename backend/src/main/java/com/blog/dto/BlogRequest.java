package com.blog.dto;

import com.blog.entity.BlogStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class BlogRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String summary;
    private String thumbnail;
    private BlogStatus status = BlogStatus.PUBLISHED;
    private Long categoryId;
    private Set<String> tags = new HashSet<>();
}
