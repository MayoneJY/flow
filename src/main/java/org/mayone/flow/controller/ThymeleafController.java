package org.mayone.flow.controller;

import org.mayone.flow.service.ExtensionService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.ui.Model;

@Controller
public class ThymeleafController {

    private final ExtensionService extensionService;

    public ThymeleafController(ExtensionService extensionService) {
        this.extensionService = extensionService;
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
}
