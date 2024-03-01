package org.mayone.flow.service;

import org.apache.ibatis.session.SqlSession;
import org.mayone.flow.mapper.ExtensionMapper;
import org.mayone.flow.model.FixedExtensionDTO;
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

    @Transactional
    public boolean insertExtension(String extension) {
        ExtensionMapper em = sqlSession.getMapper(ExtensionMapper.class);
        return em.insertCustomExtension(extension);
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
}
