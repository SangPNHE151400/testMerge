package fpt.capstone.buildingmanagementsystem.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class ErrorMessage {
    private String code;
    private String msg;
}