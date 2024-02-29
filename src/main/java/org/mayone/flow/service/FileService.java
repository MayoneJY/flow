package org.mayone.flow.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface FileService {
    boolean uploadFile(MultipartFile[] files);
}
