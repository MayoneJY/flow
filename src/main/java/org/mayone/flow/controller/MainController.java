package org.mayone.flow.controller;


import lombok.RequiredArgsConstructor;
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


//    @RequestMapping("/")
//    public String index(Model model) {
//        String[] extensions = extensionService.selectExtensions();
//        // 로그에 배열 출력
//        for (String extension : extensions) {
//            System.out.println(extension);
//        }
//        model.addAttribute("customExtensions", extensions);
//        return "index";
//    }

    @GetMapping("/customExtensions")
    public ResponseEntity<String[]> customExtensions() {
        return ResponseEntity.ok(extensionService.selectExtensions());
    }

    @PutMapping("/updateFixedExtension")
    public ResponseEntity<Boolean> updateFixedExtension(@RequestBody FixedExtensionDTO fixedExtensionDTO) {
        return ResponseEntity.ok(extensionService.updateFixedExtension(fixedExtensionDTO));
    }

    @GetMapping("/fixedExtensions")
    public ResponseEntity<List<FixedExtensionDTO>> fixedExtensions() {
        return ResponseEntity.ok(extensionService.selectFixedExtensions());
    }

    @PostMapping("/insertCustomExtension")
    public ResponseEntity<Boolean> insertCustomExtension(String extension) {
        return ResponseEntity.ok(extensionService.insertExtension(extension));
    }

    @DeleteMapping("/deleteCustomExtension")
    public ResponseEntity<Boolean> deleteCustomExtension(String extension) {
        return ResponseEntity.ok(extensionService.deleteExtension(extension));
    }

    @PostMapping("/uploadFile")
    public ResponseEntity<Boolean> uploadFile(@RequestParam("file") MultipartFile[] files) {

        return ResponseEntity.ok(fileService.uploadFile(files));
    }

    @GetMapping("/fileInformation")
    public ResponseEntity<List<FileDTO>> fileInformation() {
        return ResponseEntity.ok(fileService.fileInformation());
    }

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

}
