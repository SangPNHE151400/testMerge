package fpt.capstone.buildingmanagementsystem.repository;


import fpt.capstone.buildingmanagementsystem.model.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

public interface ChatRepository extends JpaRepository<Chat, String> {
}
