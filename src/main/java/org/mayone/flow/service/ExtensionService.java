package org.mayone.flow.service;

import org.springframework.stereotype.Service;


@Service
public interface ExtensionService {
    String[] selectExtensions();

    boolean insertExtension(String extension);

    boolean deleteExtension(String extension);
}
