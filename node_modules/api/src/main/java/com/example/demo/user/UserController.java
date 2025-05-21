package com.example.demo.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        User user = userService.getUserByJwt(authHeader);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateMyProfile(@RequestHeader("Authorization") String authHeader,
                                             @RequestBody UpdateUserRequest updateRequest) {
        User user = userService.getUserByJwt(authHeader);
        User updatedUser = userService.updateUserProfile(user, updateRequest);
        return ResponseEntity.ok(updatedUser);
    }

}
