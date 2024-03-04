package org.mayone.flow.service;

import org.apache.ibatis.session.SqlSession;
import org.mayone.flow.mapper.ExtensionMapper;
import org.mayone.flow.model.FixedExtensionDTO;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExtensionServiceImpl implements ExtensionService {
    private final SqlSession sqlSession;

    public ExtensionServiceImpl(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Transactional(readOnly = true)
    public String[] selectExtensions() {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.selectExtensions();
    }

    /**
     * 커스텀 확장자를 추가하는 메소드
     * return 0: 확장자 추가 실패
     * return 1: 확장자 추가 성공
     * return 2: 이미 존재하는 확장자
     * return 3: 의도하지 않는 글이 들어올 경우 (특수문자, 공백 등)
     * @param extension 추가할 확장자
     * @return 추가 성공 여부
     */
    @Transactional
    public int insertExtension(String extension) {
        if (!extension.matches("^[a-zA-Z0-9ㄱ-힣]*$")) {
            return 3;
        }
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        try {
            return em.insertCustomExtension(extension) ? 1 : 0;
        } catch (DataIntegrityViolationException e) {
            return 2;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public boolean deleteExtension(String extension) {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.deleteCustomExtension(extension);
    }

    @Transactional(readOnly = true)
    public List<FixedExtensionDTO> selectFixedExtensions() {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.selectFixedExtensions();
    }

    @Transactional
    public boolean updateFixedExtension(FixedExtensionDTO fixedExtensionDTO) {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.updateFixedExtension(fixedExtensionDTO);
    }

    @Transactional
    public Boolean clearFixedExtensions() {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.clearFixedExtensions();
    }

    @Transactional
    public Boolean clearCustomExtensions() {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.clearCustomExtensions();
    }

    @Transactional(readOnly = true)
    public List<String> selectAllExtensions() {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.selectAllExtensions();
    }
}
