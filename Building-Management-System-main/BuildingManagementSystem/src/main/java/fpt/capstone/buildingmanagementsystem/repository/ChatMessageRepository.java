package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.ChatMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.OvertimeLog;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findAllByChat_Id(String chatId);
    List<ChatMessage> findAllBySender(User user);
    Optional<ChatMessage> findByIdAndFileName(String id,String fileName);
}
