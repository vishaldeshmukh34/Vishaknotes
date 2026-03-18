package com.notesapp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.notesapp.backend.model.Note;
import com.notesapp.backend.model.User;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUser(User user);
}
