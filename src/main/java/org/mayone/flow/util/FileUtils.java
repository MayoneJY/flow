package org.mayone.flow.util;

import org.mayone.flow.model.FileDTO;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class FileUtils {
    private final String uploadPath = "/Users/jeongyeon/job/flowFiles";

    public FileDTO uploadFile(MultipartFile multipartFile){

        String originalName = multipartFile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String extension = StringUtils.getFilenameExtension(originalName);

        try{
            multipartFile.transferTo(new File(uploadPath + "/" + uuid + "." + extension));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return FileDTO.builder()
                .originalName(originalName)
                .saveName(uuid + "." + extension)
                .size(multipartFile.getSize())
                .build();
    }


    public Resource readFileAsResource(final FileDTO file) {
        String filename = file.getSaveName();
        Path filePath = Paths.get(uploadPath, filename);
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isFile()) {
                throw new RuntimeException("file not found : " + filePath.toString());
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("file not found : " + filePath.toString());
        }
    }

    public boolean deleteFile(FileDTO fileDTO) {
        File file = new File(uploadPath + "/" + fileDTO.getSaveName());
        return file.delete();
    }
}
