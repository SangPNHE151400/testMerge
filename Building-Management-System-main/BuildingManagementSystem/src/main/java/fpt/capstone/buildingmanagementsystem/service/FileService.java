package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.model.entity.NotificationFile;
import fpt.capstone.buildingmanagementsystem.model.response.FileResponse;
import fpt.capstone.buildingmanagementsystem.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
public class FileService {

    @Autowired
    FileRepository fileRepository;

    public void store(MultipartFile[] file, Notification notification) throws IOException {
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        for (MultipartFile multipartFile : file) {
            byte[] imageBytes = multipartFile.getBytes();
            executorService.submit(() -> {
                String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                NotificationFile fileDb = NotificationFile.builder()
                        .name(fileName)
                        .type(multipartFile.getContentType())
                        .data(imageBytes)
                        .build();
                fileDb.setNotification(notification);
                fileRepository.save(fileDb);
            });
        }
        executorService.shutdown();
    }

    public ResponseEntity<?> getALlFiles() {
        List<FileResponse> fileDbs = fileRepository.findAll().stream()
                .map(fileDb -> {
                    String fileDownloadUri = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/files/")
                            .path(fileDb.getFileId())
                            .toUriString();
                    return FileResponse.builder()
                            .name(fileDb.getName())
                            .url(fileDownloadUri)
                            .type(fileDb.getType())
                            .size(fileDb.getData().length)
                            .build();
                }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(fileDbs);
    }

    public ResponseEntity<?> getFile(String id) {
        NotificationFile fileDb = fileRepository.findById(id).orElseGet(NotificationFile::new);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attach, fileName=\"" + fileDb.getName() + "\"")
                .body(fileDb.getName());
    }
}
