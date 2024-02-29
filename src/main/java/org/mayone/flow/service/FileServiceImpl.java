package org.mayone.flow.service;

import org.apache.ibatis.session.SqlSession;
import org.mayone.flow.mapper.FileMapper;
import org.mayone.flow.model.FileDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService{
    private final SqlSession sqlSession;

    public FileServiceImpl(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Transactional
    public boolean uploadFile(MultipartFile[] files) {
        String uploadPath = "/Users/jeongyeon/job/flowFiles";
        List<FileDTO> fileDTOList = new ArrayList<>();
        for (MultipartFile file : files) {
            String originalName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
            String extension = StringUtils.getFilenameExtension(originalName);
            FileDTO fileDTO = FileDTO.builder()
                    .originalName(originalName)
                    .saveName(uuid + "." + extension)
                    .size(file.getSize())
                    .build();

            try{
                file.transferTo(new File(uploadPath + "/" + uuid + "." + extension));
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }

            fileDTOList.add(fileDTO);
        }

        FileMapper fm = sqlSession.getMapper(FileMapper.class);
        return fm.insertFile(fileDTOList);
    }
}
