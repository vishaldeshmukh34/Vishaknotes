package com.notesapp.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notesapp.backend.model.Note;
import com.notesapp.backend.model.User;
import com.notesapp.backend.repository.NoteRepository;
import com.notesapp.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper to get logged in user
    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    // GET ALL NOTES of logged in user
    @GetMapping
    public ResponseEntity<?> getAllNotes() {
        User user = getLoggedInUser();
        List<Note> notes = noteRepository.findByUser(user);
        return ResponseEntity.ok(notes);
    }

    // GET SINGLE NOTE by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getNoteById(@PathVariable Long id) {
        User user = getLoggedInUser();
        Optional<Note> noteOpt = noteRepository.findById(id);

        if (noteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Note note = noteOpt.get();
        if (!note.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Access denied!"));
        }

        return ResponseEntity.ok(note);
    }

    // CREATE NOTE
    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody Map<String, String> body) {
        User user = getLoggedInUser();

        Note note = new Note();
        note.setTitle(body.get("title"));
        note.setContent(body.get("content"));
        note.setUser(user);

        noteRepository.save(note);
        return ResponseEntity.ok(note);
    }

    // UPDATE NOTE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = getLoggedInUser();
        Optional<Note> noteOpt = noteRepository.findById(id);

        if (noteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Note note = noteOpt.get();
        if (!note.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Access denied!"));
        }

        note.setTitle(body.get("title"));
        note.setContent(body.get("content"));
        noteRepository.save(note);

        return ResponseEntity.ok(note);
    }

    // DELETE NOTE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        User user = getLoggedInUser();
        Optional<Note> noteOpt = noteRepository.findById(id);

        if (noteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Note note = noteOpt.get();
        if (!note.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Access denied!"));
        }

        noteRepository.delete(note);
        return ResponseEntity.ok(Map.of("message", "Note deleted successfully!"));
    }
}
