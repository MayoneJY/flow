package org.mayone.flow.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileDTO {
    private Long idx;
    private String originalName;
    private String saveName;
    private Long size;
    private String timeStamp;
}

