package com.blog.controller;

import com.blog.dto.UserDto;
import com.blog.security.UserPrincipal;
import com.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserDto dto
    ) {
        return ResponseEntity.ok(userService.updateProfile(principal.getId(), dto));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> payload
    ) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        userService.changePassword(principal.getId(), currentPassword, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
