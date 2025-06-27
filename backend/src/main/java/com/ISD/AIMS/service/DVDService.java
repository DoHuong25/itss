package com.ISD.AIMS.service;

import com.ISD.AIMS.model.DVD;
import com.ISD.AIMS.repository.DVDRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DVDService {

    @Autowired
    private DVDRepository dvdRepository;

    public List<DVD> getAllDVDs() {
        return dvdRepository.findAll();
    }

    public Optional<DVD> getDVDById(Long id) {
        return dvdRepository.findById(id);
    }

    public DVD saveDVD(DVD dvd) {
        return dvdRepository.save(dvd);
    }

    public void deleteDVD(Long id) {
        dvdRepository.deleteById(id);
    }

    public List<DVD> searchByTitle(String keyword) {
        return dvdRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<DVD> searchByDirector(String director) {
        return dvdRepository.findByDirectorContainingIgnoreCase(director);
    }

    public List<DVD> searchByGenre(String genre) {
        return dvdRepository.findByGenre(genre);
    }
}