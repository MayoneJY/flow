package org.mayone.flow.service;

import org.apache.ibatis.session.SqlSession;
import org.mayone.flow.mapper.ExtensionMapper;
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
}
