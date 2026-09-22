package com.blog.service;

import com.blog.dto.UserDto;
import com.blog.entity.User;
import com.blog.exception.BadRequestException;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return authService.mapToDto(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return authService.mapToDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, UserDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
        }
        if (dto.getProfileImage() != null) {
            user.setProfileImage(dto.getProfileImage().trim());
        }
        if (dto.getBio() != null) {
            user.setBio(dto.getBio().trim());
        }

        User updated = userRepository.save(user);
        return authService.mapToDto(updated);
    }

    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }
        if (newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
