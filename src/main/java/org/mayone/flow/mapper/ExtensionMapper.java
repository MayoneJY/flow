package org.mayone.flow.mapper;


import org.mayone.flow.model.FixedExtensionDTO;

import java.util.List;

public interface ExtensionMapper {
    String[] selectExtensions();

    boolean insertCustomExtension(String extension);

    boolean deleteCustomExtension(String extension);

    List<FixedExtensionDTO> selectFixedExtensions();

    boolean updateFixedExtension(FixedExtensionDTO fixedExtensionDTO);
}
