package org.mayone.flow.controller;

import org.mayone.flow.service.ExtensionService;
import org.mayone.flow.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Controller
public class MainController {

    private final ExtensionService extensionService;
    private final FileService fileService;

    public MainController(ExtensionService extensionService, FileService fileService) {
        this.extensionService = extensionService;
        this.fileService = fileService;
    }

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

}
