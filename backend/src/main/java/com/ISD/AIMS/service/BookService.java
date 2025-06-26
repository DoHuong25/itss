package com.ISD.AIMS.service;

import com.ISD.AIMS.model.Book;
import com.ISD.AIMS.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public List<Book> searchByTitle(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Book> searchByAuthor(String author) {
        return bookRepository.findByAuthorsContainingIgnoreCase(author);
    }

    public List<Book> searchByGenre(String genre) {
        return bookRepository.findByGenre(genre);
    }
}