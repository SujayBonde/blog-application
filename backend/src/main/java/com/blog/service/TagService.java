package com.blog.service;

import com.blog.dto.TagDto;
import com.blog.entity.Tag;
import com.blog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<TagDto> getAllTags() {
        return tagRepository.findAll().stream()
                .map(tag -> TagDto.builder().id(tag.getId()).name(tag.getName()).build())
                .collect(Collectors.toList());
    }

    @Transactional
    public Set<Tag> getOrCreateTags(Set<String> tagNames) {
        Set<Tag> tags = new HashSet<>();
        if (tagNames == null) return tags;

        for (String rawName : tagNames) {
            String name = rawName.trim().toLowerCase();
            if (name.isBlank()) continue;

            Tag tag = tagRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
            tags.add(tag);
        }
        return tags;
    }
}
