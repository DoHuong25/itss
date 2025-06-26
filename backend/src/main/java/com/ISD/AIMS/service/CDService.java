
package com.ISD.AIMS.service;

import com.ISD.AIMS.model.CD;
import com.ISD.AIMS.repository.CDRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CDService {

    @Autowired
    private CDRepository cdRepository;

    // Lấy tất cả CD
    public List<CD> getAllCDs() {
        return cdRepository.findAll();
    }

    // Lấy CD theo ID
    public Optional<CD> getCDById(Long id) {
        return cdRepository.findById(id);
    }

    // Thêm hoặc cập nhật CD
    public CD saveCD(CD cd) {
        return cdRepository.save(cd);
    }

    // Xoá CD theo ID
    public void deleteCD(Long id) {
        cdRepository.deleteById(id);
    }

    // Tìm kiếm theo tiêu đề
    public List<CD> searchByTitle(String keyword) {
        return cdRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // Tìm theo nghệ sĩ
    public List<CD> searchByArtist(String artist) {
        return cdRepository.findByArtistContainingIgnoreCase(artist);
    }

    // Tìm theo thể loại
    public List<CD> searchByGenre(String genre) {
        return cdRepository.findByGenre(genre);
    }
}
