package fpt.capstone.buildingmanagementsystem.exception;

public class ForbiddenError  extends RuntimeException {
    public ForbiddenError(String message) {
        super(message);
    }
}