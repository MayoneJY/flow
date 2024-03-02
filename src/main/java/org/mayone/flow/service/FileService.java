package org.mayone.flow.service;

import org.mayone.flow.model.FileDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface FileService {
    int uploadFile(MultipartFile[] files);

    List<FileDTO> fileInformation();

    FileDTO selectFile(int idx);

    boolean deleteFile(FileDTO fileDTO);
}
