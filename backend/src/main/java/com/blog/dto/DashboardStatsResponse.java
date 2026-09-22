package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalBlogs;
    private long publishedBlogs;
    private long draftBlogs;
    private long totalComments;
    private long totalLikes;
    private long totalCategories;
}
