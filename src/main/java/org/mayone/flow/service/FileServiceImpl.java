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
    private final ExtensionService extensionService;

    /**
     * 파일을 업로드하는 메소드
     * return 0: 파일 업로드 실패
     * return 1: 파일 업로드 성공
     * return 2: 파일 확장자가 허용되지 않음
     * @param files 업로드할 파일
     * @return 업로드 성공 여부
     */
    @Transactional
    public int uploadFile(MultipartFile[] files) {
        List<String> fileExtensionList = extensionService.selectAllExtensions();
        for (MultipartFile file : files) {
            String fileExtension = fileUtils.getFileExtension(file);
            if(fileExtensionList.contains(fileExtension)) {
                return 2;
            }
        }
        List<FileDTO> fileDTOList = new ArrayList<>();
        for (MultipartFile file : files) {
            FileDTO fileDTO = fileUtils.uploadFile(file);
            if(fileDTO == null) {
                return 0;
            }
            fileDTOList.add(fileDTO);
        }

        FileMapper fm = sqlSession.getMapper(FileMapper.class);
        return fm.insertFile(fileDTOList) ? 1 : 0;
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

    @Transactional
    public boolean deleteFile(FileDTO fileDTO) {
        FileMapper fm = sqlSession.getMapper(FileMapper.class);
        fm.deleteFile(fileDTO.getIdx());
        return fileUtils.deleteFile(fileDTO);
    }
}
