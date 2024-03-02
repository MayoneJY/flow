package org.mayone.flow.util;

import lombok.RequiredArgsConstructor;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FileUtils {
//    private final String uploadPath = "/Users/jeongyeon/job/flowFiles";
    private final String uploadPath = "/home/mayone/flow/downloads";


    // 파일 업로드
    public FileDTO uploadFile(MultipartFile multipartFile){
        String originalName = multipartFile.getOriginalFilename();
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String extension = StringUtils.getFilenameExtension(originalName);

        try{
            multipartFile.transferTo(new File(uploadPath + "/" + uuid + "." + extension));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return FileDTO.builder()
                .originalName(originalName)
                .saveName(uuid + "." + extension)
                .size(multipartFile.getSize())
                .build();
    }


    // 파일 다운로드
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

    // 파일 삭제
    public boolean deleteFile(FileDTO fileDTO) {
        File file = new File(uploadPath + "/" + fileDTO.getSaveName());
        return file.delete();
    }

    public String getFileExtension(MultipartFile file) {
        return StringUtils.getFilenameExtension(file.getOriginalFilename());
    }

    // 서버에 저장된 파일에 추가하려는 확장자가 있는지 확인
    public List<String> checkExtension(List<FileDTO> fileDTO, String extension) {
        List<String> fileNames = new ArrayList<>();
        for (FileDTO file : fileDTO) {
            if (Objects.equals(StringUtils.getFilenameExtension(file.getOriginalName()), extension)) {
                fileNames.add(file.getOriginalName());
            }
        }
        return fileNames;
    }
}
