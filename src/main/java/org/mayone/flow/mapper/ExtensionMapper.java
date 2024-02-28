package org.mayone.flow.mapper;


public interface ExtensionMapper {
    String[] selectExtensions();

    boolean insertCustomExtension(String extension);

    boolean deleteCustomExtension(String extension);
}
