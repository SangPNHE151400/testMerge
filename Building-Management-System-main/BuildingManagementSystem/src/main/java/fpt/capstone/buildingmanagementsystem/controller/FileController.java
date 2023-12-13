package fpt.capstone.buildingmanagementsystem.controller;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import fpt.capstone.buildingmanagementsystem.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin
public class FileController {

    @Autowired
    FileService fileService;
    @GetMapping("files")
    public ResponseEntity<?> getAllFiles() {
        return fileService.getALlFiles();
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<?> getFile(@PathVariable String id) {
        return fileService.getFile(id);
    }
    @GetMapping("/cleanFirebase/{name}")
    public void cleanFirebase(@PathVariable String name) {
        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.get(name);
        if (blob != null) {
            blob.delete();
        }
    }

}
