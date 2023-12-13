package fpt.capstone.buildingmanagementsystem.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluateByHrRequest {
    String hrId;
    String hrNote;
    String evaluateId;
    String hrStatus;
}
