package com.example.demo.service;

import com.example.demo.model.Libro;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class LibroService {

    private final List<Libro> libros = new ArrayList<>();
    private final AtomicLong contador = new AtomicLong(0);

    public LibroService() {
        libros.add(new Libro(
            contador.incrementAndGet(),
            "Cien años de soledad",
            "Gabriel García Márquez"
        ));

        libros.add(new Libro(
            contador.incrementAndGet(),
            "El principito",
            "Antoine de Saint-Exupéry"
        ));
    }

    public List<Libro> listarLibros() {
        return libros;
    }

    public Libro crearLibro(String titulo, String autor) {
        Libro libro = new Libro(
            contador.incrementAndGet(),
            titulo.trim(),
            autor.trim()
        );

        libros.add(libro);
        return libro;
    }

    public boolean eliminarLibro(Long id) {
        return libros.removeIf(
            libro -> libro.getId().equals(id)
        );
    }
}
