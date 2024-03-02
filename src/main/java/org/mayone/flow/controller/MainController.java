package org.mayone.flow.controller;


import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Delete;
import org.mayone.flow.model.FileDTO;
import org.mayone.flow.model.FixedExtensionDTO;
import org.mayone.flow.service.ExtensionService;
import org.mayone.flow.service.FileService;
import org.mayone.flow.util.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;


@Controller
@RequiredArgsConstructor
public class MainController {

    private final ExtensionService extensionService;
    private final FileService fileService;
    private final FileUtils fileUtils;

    // 커스텀 확장자를 조회하는 메소드
    @GetMapping("/customExtensions")
    public ResponseEntity<String[]> customExtensions() {
        return ResponseEntity.ok(extensionService.selectExtensions());
    }

    // 고정 확장자를 수정하는 메소드
    @PutMapping("/updateFixedExtension")
    public ResponseEntity<Boolean> updateFixedExtension(@RequestBody FixedExtensionDTO fixedExtensionDTO) {
        return ResponseEntity.ok(extensionService.updateFixedExtension(fixedExtensionDTO));
    }

    // 고정 확장자를 조회하는 메소드
    @GetMapping("/fixedExtensions")
    public ResponseEntity<List<FixedExtensionDTO>> fixedExtensions() {
        return ResponseEntity.ok(extensionService.selectFixedExtensions());
    }

    // 고정 확장자를 초기화하는 메소드
    @PutMapping("/clearFixedExtensions")
    public ResponseEntity<Boolean> clearFixedExtensions() {
        return ResponseEntity.ok(extensionService.clearFixedExtensions());
    }

    // 커스텀 확장자를 추가하는 메소드
    @PostMapping("/insertCustomExtension")
    public ResponseEntity<Boolean> insertCustomExtension(String extension) {
        return ResponseEntity.ok(extensionService.insertExtension(extension));
    }

    // 커스텀 확장자를 삭제하는 메소드
    @DeleteMapping("/deleteCustomExtension")
    public ResponseEntity<Boolean> deleteCustomExtension(String extension) {
        return ResponseEntity.ok(extensionService.deleteExtension(extension));
    }

    // 커스텀 확장자를 초기화하는 메소드
    @DeleteMapping("/clearCustomExtensions")
    public ResponseEntity<Boolean> clearCustomExtensions() {
        return ResponseEntity.ok(extensionService.clearCustomExtensions());
    }

    // 파일을 업로드하는 메소드
    @PostMapping("/uploadFile")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile[] files) {
        try {
            int result = fileService.uploadFile(files);
            if (result == 1)
                return ResponseEntity.ok().body(true);
            else if (result == 2)
                return ResponseEntity.badRequest().body("확장자 제한에 걸린 파일이 존재합니다.");
            else
                return ResponseEntity.badRequest().body("파일 업로드에 실패했습니다.");
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body("파일 업로드에 실패했습니다.");
        }
    }

    // 파일 정보를 조회하는 메소드
    @GetMapping("/fileInformation")
    public ResponseEntity<List<FileDTO>> fileInformation() {
        return ResponseEntity.ok(fileService.fileInformation());
    }

    // 파일을 다운로드하는 메소드
    @GetMapping("/downloadFile/{idx}")
    public ResponseEntity<Resource> downloadFile(@PathVariable int idx) {
        FileDTO fileDTO = fileService.selectFile(idx);
        Resource resource = fileUtils.readFileAsResource(fileDTO);
        String originalName = URLEncoder.encode(fileDTO.getOriginalName(), StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", "attachment; filename=\"" + originalName + "\"")
                .body(resource);
    }

    // 파일을 삭제하는 메소드
    @DeleteMapping("/deleteFile")
    public ResponseEntity<Boolean> deleteFile(@RequestBody FileDTO fileDTO) {
        return ResponseEntity.ok(fileService.deleteFile(fileDTO));
    }

}
