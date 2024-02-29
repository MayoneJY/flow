package org.mayone.flow.mapper;

import org.mayone.flow.model.FileDTO;

import java.util.List;

public interface FileMapper {
    boolean insertFile(List<FileDTO> fileDTOList);
}
