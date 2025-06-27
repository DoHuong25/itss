package com.ISD.AIMS.controller;

import com.ISD.AIMS.model.Book;
import com.ISD.AIMS.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Optional<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book updatedBook) {
        Optional<Book> existing = bookService.getBookById(id);
        if (existing.isPresent()) {
            Book book = existing.get();
            // [SỬA LỖI] Chỉ cập nhật các trường có trên form quản trị
            book.setTitle(updatedBook.getTitle());
            book.setPrice(updatedBook.getPrice());
            book.setQuantity(updatedBook.getQuantity());
            book.setImageUrl(updatedBook.getImageUrl());
            book.setDescription(updatedBook.getDescription());
            book.setAuthors(updatedBook.getAuthors());
            book.setCoverType(updatedBook.getCoverType());
            book.setPublisher(updatedBook.getPublisher());
            book.setPublicationDate(updatedBook.getPublicationDate());
            book.setNumberOfPages(updatedBook.getNumberOfPages());
            book.setLanguage(updatedBook.getLanguage());
            book.setGenre(updatedBook.getGenre());
            // Các trường như barcode, value, weight... sẽ được giữ nguyên
            return bookService.saveBook(book);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @GetMapping("/search/title")
    public List<Book> searchByTitle(@RequestParam String keyword) {
        return bookService.searchByTitle(keyword);
    }

    @GetMapping("/search/author")
    public List<Book> searchByAuthor(@RequestParam String author) {
        return bookService.searchByAuthor(author);
    }

    @GetMapping("/search/genre")
    public List<Book> searchByGenre(@RequestParam String genre) {
        return bookService.searchByGenre(genre);
    }
}
