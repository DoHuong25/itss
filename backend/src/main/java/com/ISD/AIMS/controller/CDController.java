package com.ISD.AIMS.controller;

import com.ISD.AIMS.model.CD;
import com.ISD.AIMS.service.CDService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cds")
@CrossOrigin(origins = "http://localhost:5173")
public class CDController {

    @Autowired
    private CDService cdService;

    @GetMapping
    public List<CD> getAllCDs() {
        return cdService.getAllCDs();
    }

    @GetMapping("/{id}")
    public Optional<CD> getCDById(@PathVariable Long id) {
        return cdService.getCDById(id);
    }

    @PostMapping
    public CD createCD(@RequestBody CD cd) {
        return cdService.saveCD(cd);
    }

    @PutMapping("/{id}")
    public CD updateCD(@PathVariable Long id, @RequestBody CD updatedCD) {
        Optional<CD> existing = cdService.getCDById(id);
        if (existing.isPresent()) {
            CD cd = existing.get();
            // [SỬA LỖI] Chỉ cập nhật các trường có trên form quản trị
            cd.setTitle(updatedCD.getTitle());
            cd.setPrice(updatedCD.getPrice());
            cd.setQuantity(updatedCD.getQuantity());
            cd.setImageUrl(updatedCD.getImageUrl());
            cd.setDescription(updatedCD.getDescription());
            cd.setArtist(updatedCD.getArtist());
            cd.setRecordLabel(updatedCD.getRecordLabel());
            cd.setTracklist(updatedCD.getTracklist());
            cd.setGenre(updatedCD.getGenre());
            cd.setReleaseDate(updatedCD.getReleaseDate());
            // Các trường như barcode, value, weight... sẽ được giữ nguyên
            return cdService.saveCD(cd);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteCD(@PathVariable Long id) {
        cdService.deleteCD(id);
    }

    @GetMapping("/search/title")
    public List<CD> searchByTitle(@RequestParam String keyword) {
        return cdService.searchByTitle(keyword);
    }

    @GetMapping("/search/artist")
    public List<CD> searchByArtist(@RequestParam String artist) {
        return cdService.searchByArtist(artist);
    }

    @GetMapping("/search/genre")
    public List<CD> searchByGenre(@RequestParam String genre) {
        return cdService.searchByGenre(genre);
    }
}
