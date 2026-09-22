package com.blog.service;

import com.blog.dto.*;
import com.blog.entity.*;
import com.blog.exception.BadRequestException;
import com.blog.exception.ResourceNotFoundException;
import com.blog.exception.UnauthorizedException;
import com.blog.repository.*;
import com.blog.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;
    private final AuthService authService;
    private final CategoryService categoryService;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Transactional
    public BlogResponse createBlog(BlogRequest request, Long currentUserId) {
        User author = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        Set<Tag> tags = tagService.getOrCreateTags(request.getTags());

        String slug = generateUniqueSlug(request.getTitle(), null);

        String summary = request.getSummary();
        if (summary == null || summary.isBlank()) {
            summary = generateSummary(request.getContent());
        }

        Blog blog = Blog.builder()
                .title(request.getTitle().trim())
                .slug(slug)
                .content(request.getContent())
                .summary(summary)
                .thumbnail(request.getThumbnail() != null && !request.getThumbnail().isBlank()
                        ? request.getThumbnail()
                        : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80")
                .status(request.getStatus() != null ? request.getStatus() : BlogStatus.PUBLISHED)
                .author(author)
                .category(category)
                .tags(tags)
                .build();

        Blog saved = blogRepository.save(blog);
        return mapToResponse(saved, currentUserId);
    }

    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest request, Long currentUserId, boolean isAdmin) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        if (!isAdmin && !blog.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to edit this blog post");
        }

        if (!blog.getTitle().equalsIgnoreCase(request.getTitle().trim())) {
            blog.setTitle(request.getTitle().trim());
            blog.setSlug(generateUniqueSlug(request.getTitle(), blog.getId()));
        }

        blog.setContent(request.getContent());

        if (request.getSummary() != null && !request.getSummary().isBlank()) {
            blog.setSummary(request.getSummary().trim());
        } else {
            blog.setSummary(generateSummary(request.getContent()));
        }

        if (request.getThumbnail() != null && !request.getThumbnail().isBlank()) {
            blog.setThumbnail(request.getThumbnail());
        }

        if (request.getStatus() != null) {
            blog.setStatus(request.getStatus());
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            blog.setCategory(category);
        } else {
            blog.setCategory(null);
        }

        blog.setTags(tagService.getOrCreateTags(request.getTags()));

        Blog updated = blogRepository.save(blog);
        return mapToResponse(updated, currentUserId);
    }

    @Transactional
    public void deleteBlog(Long id, Long currentUserId, boolean isAdmin) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        if (!isAdmin && !blog.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to delete this blog post");
        }

        blogRepository.delete(blog);
    }

    @Transactional(readOnly = true)
    public BlogResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "slug", slug));

        Long currentUserId = getCurrentUserIdOrNull();
        return mapToResponse(blog, currentUserId);
    }

    @Transactional(readOnly = true)
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        Long currentUserId = getCurrentUserIdOrNull();
        return mapToResponse(blog, currentUserId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<BlogResponse> getAllBlogs(
            int page,
            int size,
            String sortBy,
            String sortDir,
            Long categoryId,
            String tagName,
            String keyword,
            Long authorId,
            BlogStatus status
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        BlogStatus queryStatus = (status != null) ? status : BlogStatus.PUBLISHED;

        Page<Blog> blogPage;

        if (keyword != null && !keyword.isBlank()) {
            blogPage = blogRepository.searchBlogs(keyword.trim(), queryStatus, pageable);
        } else if (categoryId != null) {
            blogPage = blogRepository.findByCategoryIdAndStatus(categoryId, queryStatus, pageable);
        } else if (tagName != null && !tagName.isBlank()) {
            blogPage = blogRepository.findByTagNameAndStatus(tagName.trim(), queryStatus, pageable);
        } else if (authorId != null) {
            if (status == null) {
                blogPage = blogRepository.findByAuthorId(authorId, pageable);
            } else {
                blogPage = blogRepository.findByAuthorIdAndStatus(authorId, status, pageable);
            }
        } else {
            blogPage = blogRepository.findByStatus(queryStatus, pageable);
        }

        Long currentUserId = getCurrentUserIdOrNull();

        return PagedResponse.<BlogResponse>builder()
                .content(blogPage.getContent().stream()
                        .map(blog -> mapToResponse(blog, currentUserId))
                        .collect(Collectors.toList()))
                .page(blogPage.getNumber())
                .size(blogPage.getSize())
                .totalElements(blogPage.getTotalElements())
                .totalPages(blogPage.getTotalPages())
                .last(blogPage.isLast())
                .build();
    }

    public BlogResponse mapToResponse(Blog blog, Long currentUserId) {
        long likesCount = likeRepository.countByBlogId(blog.getId());
        long commentsCount = commentRepository.countByBlogId(blog.getId());
        boolean likedByCurrent = false;

        if (currentUserId != null) {
            likedByCurrent = likeRepository.existsByUserIdAndBlogId(currentUserId, blog.getId());
        }

        Set<TagDto> tagDtos = blog.getTags().stream()
                .map(t -> TagDto.builder().id(t.getId()).name(t.getName()).build())
                .collect(Collectors.toSet());

        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .slug(blog.getSlug())
                .content(blog.getContent())
                .summary(blog.getSummary())
                .thumbnail(blog.getThumbnail())
                .status(blog.getStatus())
                .author(authService.mapToDto(blog.getAuthor()))
                .category(blog.getCategory() != null ? categoryService.mapToDto(blog.getCategory()) : null)
                .tags(tagDtos)
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .likedByCurrentUser(likedByCurrent)
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }

    private Long getCurrentUserIdOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getId();
        }
        return null;
    }

    private String generateSummary(String content) {
        if (content == null) return "";
        // Strip markdown and HTML tags for a clean summary
        String plainText = content.replaceAll("<[^>]*>", "")
                .replaceAll("[#*`_\\[\\]()]", "")
                .replaceAll("\\s+", " ")
                .trim();
        return plainText.length() > 200 ? plainText.substring(0, 197) + "..." : plainText;
    }

    private String generateUniqueSlug(String title, Long existingId) {
        String nowhitespace = WHITESPACE.matcher(title.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("").toLowerCase(Locale.ENGLISH);

        if (slug.isBlank()) {
            slug = "post-" + System.currentTimeMillis();
        }

        String candidate = slug;
        int count = 1;
        while (true) {
            var existing = blogRepository.findBySlug(candidate);
            if (existing.isEmpty() || (existingId != null && existing.get().getId().equals(existingId))) {
                return candidate;
            }
            candidate = slug + "-" + count++;
        }
    }
}
