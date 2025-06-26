package com.ISD.AIMS.controller;

import com.ISD.AIMS.model.DVD;
import com.ISD.AIMS.service.DVDService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dvds")
@CrossOrigin(origins = "http://localhost:5173")
public class DVDController {

    @Autowired
    private DVDService dvdService;

    @GetMapping
    public List<DVD> getAllDVDs() {
        return dvdService.getAllDVDs();
    }

    @GetMapping("/{id}")
    public Optional<DVD> getDVDById(@PathVariable Long id) {
        return dvdService.getDVDById(id);
    }

    @PostMapping
    public DVD createDVD(@RequestBody DVD dvd) {
        return dvdService.saveDVD(dvd);
    }

    @PutMapping("/{id}")
    public DVD updateDVD(@PathVariable Long id, @RequestBody DVD updatedDVD) {
        Optional<DVD> existing = dvdService.getDVDById(id);
        if (existing.isPresent()) {
            DVD dvd = existing.get();
            // [SỬA LỖI] Chỉ cập nhật các trường có trên form quản trị
            dvd.setTitle(updatedDVD.getTitle());
            dvd.setPrice(updatedDVD.getPrice());
            dvd.setQuantity(updatedDVD.getQuantity());
            dvd.setImageUrl(updatedDVD.getImageUrl());
            dvd.setDescription(updatedDVD.getDescription());
            dvd.setDirector(updatedDVD.getDirector());
            dvd.setStudio(updatedDVD.getStudio());
            dvd.setDiscType(updatedDVD.getDiscType());
            dvd.setRuntime(updatedDVD.getRuntime());
            dvd.setGenre(updatedDVD.getGenre());
            dvd.setLanguage(updatedDVD.getLanguage());
            dvd.setSubtitles(updatedDVD.getSubtitles());
            dvd.setReleaseDate(updatedDVD.getReleaseDate());
            // Các trường như barcode, value, weight... sẽ được giữ nguyên
            return dvdService.saveDVD(dvd);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteDVD(@PathVariable Long id) {
        dvdService.deleteDVD(id);
    }

    @GetMapping("/search/title")
    public List<DVD> searchByTitle(@RequestParam String keyword) {
        return dvdService.searchByTitle(keyword);
    }

    @GetMapping("/search/director")
    public List<DVD> searchByDirector(@RequestParam String director) {
        return dvdService.searchByDirector(director);
    }

    @GetMapping("/search/genre")
    public List<DVD> searchByGenre(@RequestParam String genre) {
        return dvdService.searchByGenre(genre);
    }
}
