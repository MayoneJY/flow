package org.mayone.flow.service;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.mayone.flow.mapper.FileMapper;
import org.mayone.flow.model.FileDTO;
import org.mayone.flow.util.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService{
    private final SqlSession sqlSession;
    private final FileUtils fileUtils;

    @Transactional
    public boolean uploadFile(MultipartFile[] files) {
        List<FileDTO> fileDTOList = new ArrayList<>();
        for (MultipartFile file : files) {

            fileDTOList.add(fileUtils.uploadFile(file));
        }

        FileMapper fm = sqlSession.getMapper(FileMapper.class);
        return fm.insertFile(fileDTOList);
    }

    @Transactional(readOnly = true)
    public List<FileDTO> fileInformation() {
        FileMapper fm = sqlSession.getMapper(FileMapper.class);
        return fm.selectFiles();
    }

    @Transactional(readOnly = true)
    public FileDTO selectFile(int idx) {
        FileMapper fm = sqlSession.getMapper(FileMapper.class);
        return fm.selectFile(idx);
    }
}
