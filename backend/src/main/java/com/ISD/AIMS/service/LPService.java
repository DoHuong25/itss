package com.ISD.AIMS.service;

import com.ISD.AIMS.model.LP;
import com.ISD.AIMS.repository.LPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LPService {

    @Autowired
    private LPRepository lpRepository;

    public List<LP> getAllLPs() {
        return lpRepository.findAll();
    }

    public Optional<LP> getLPById(Long id) {
        return lpRepository.findById(id);
    }

    public LP saveLP(LP lp) {
        return lpRepository.save(lp);
    }

    public void deleteLP(Long id) {
        lpRepository.deleteById(id);
    }

    public List<LP> searchByTitle(String keyword) {
        return lpRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<LP> searchByArtist(String artist) {
        return lpRepository.findByArtistContainingIgnoreCase(artist);
    }

    public List<LP> searchByGenre(String genre) {
        return lpRepository.findByGenre(genre);
    }
}