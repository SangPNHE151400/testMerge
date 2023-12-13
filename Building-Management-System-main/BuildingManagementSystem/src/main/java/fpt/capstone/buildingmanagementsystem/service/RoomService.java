package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.model.entity.Room;
import fpt.capstone.buildingmanagementsystem.model.response.RoomResponse;
import fpt.capstone.buildingmanagementsystem.repository.RoomRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public List<RoomResponse> getAllRoom() {
        return roomRepository.findAll()
                .stream().map(room -> {
                    RoomResponse roomResponse = new RoomResponse();
                    BeanUtils.copyProperties(room, roomResponse);
                    return roomResponse;
                })
                .collect(Collectors.toList());
    }

    public RoomResponse getRoomById(int id) {
        RoomResponse roomResponse = new RoomResponse();
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new BadRequest("not_found_room"));
        BeanUtils.copyProperties(room, roomResponse);
        return roomResponse;
    }
}
