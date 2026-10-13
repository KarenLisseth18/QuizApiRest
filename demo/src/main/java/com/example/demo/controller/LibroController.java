package com.example.demo.controller;

import com.example.demo.model.Libro;
import com.example.demo.service.LibroService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "http://localhost:5173")
public class LibroController {

    private final LibroService libroService;

    public LibroController(LibroService libroService) {
        this.libroService = libroService;
    }

    @GetMapping
    public ResponseEntity<List<Libro>> listarLibros() {
        return ResponseEntity.ok(libroService.listarLibros());
    }

    @PostMapping
    public ResponseEntity<?> crearLibro(@RequestBody Libro libro) {

        if (libro.getTitulo() == null
                || libro.getTitulo().isBlank()
                || libro.getAutor() == null
                || libro.getAutor().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("El título y el autor son obligatorios.");
        }

        Libro nuevoLibro = libroService.crearLibro(
                libro.getTitulo(),
                libro.getAutor()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(nuevoLibro);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {

        boolean eliminado = libroService.eliminarLibro(id);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
