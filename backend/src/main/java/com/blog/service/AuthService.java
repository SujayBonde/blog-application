package com.blog.service;

import com.blog.dto.AuthResponse;
import com.blog.dto.LoginRequest;
import com.blog.dto.RegisterRequest;
import com.blog.dto.UserDto;
import com.blog.entity.Role;
import com.blog.entity.User;
import com.blog.exception.BadRequestException;
import com.blog.repository.UserRepository;
import com.blog.security.JwtService;
import com.blog.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .profileImage(request.getProfileImage() != null && !request.getProfileImage().isBlank()
                        ? request.getProfileImage()
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80")
                .bio(request.getBio())
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);
        UserPrincipal userPrincipal = new UserPrincipal(savedUser);
        String token = jwtService.generateToken(userPrincipal);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToDto(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtService.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToDto(user))
                .build();
    }

    public UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
