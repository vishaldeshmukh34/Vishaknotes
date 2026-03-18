package com.notesapp.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notesapp.backend.config.JwtUtil;
import com.notesapp.backend.model.User;
import com.notesapp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        if (userRepository.existsByEmail(body.get("email"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists!"));
        }
        if (userRepository.existsByUsername(body.get("username"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists!"));
        }

        User user = new User();
        user.setUsername(body.get("username"));
        user.setEmail(body.get("email"));
        user.setPassword(passwordEncoder.encode(body.get("password")));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findByEmail(body.get("email"));

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found!"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(body.get("password"), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Wrong password!"));
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", user.getUsername(),
            "email", user.getEmail()
        ));
    }
}