package com.blog.service;

import com.blog.dto.CategoryDto;
import com.blog.entity.Category;
import com.blog.exception.BadRequestException;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new BadRequestException("Category already exists: " + dto.getName());
        }

        Category category = Category.builder()
                .name(dto.getName().trim())
                .description(dto.getDescription())
                .build();

        return mapToDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (!category.getName().equalsIgnoreCase(dto.getName().trim()) &&
                categoryRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new BadRequestException("Category name already in use: " + dto.getName());
        }

        category.setName(dto.getName().trim());
        category.setDescription(dto.getDescription());
        return mapToDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
    }

    public CategoryDto mapToDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .blogCount((long) (category.getBlogs() != null ? category.getBlogs().size() : 0))
                .build();
    }
}
