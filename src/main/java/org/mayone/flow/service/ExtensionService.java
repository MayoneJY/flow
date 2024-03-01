package org.mayone.flow.service;

import org.mayone.flow.model.FixedExtensionDTO;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public interface ExtensionService {
    String[] selectExtensions();

    boolean insertExtension(String extension);

    boolean deleteExtension(String extension);

    List<FixedExtensionDTO> selectFixedExtensions();

    boolean updateFixedExtension(FixedExtensionDTO fixedExtensionDTO);

    Boolean clearFixedExtensions();

    Boolean clearCustomExtensions();
}
