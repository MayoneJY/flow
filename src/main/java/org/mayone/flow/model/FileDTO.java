package org.mayone.flow.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FileDTO {
    private Long idx;
    private String originalName;
    private String saveName;
    private Long size;
    private LocalDateTime createdDate;
}

