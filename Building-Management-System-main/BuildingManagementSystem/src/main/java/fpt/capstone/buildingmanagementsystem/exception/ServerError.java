package fpt.capstone.buildingmanagementsystem.exception;


public class ServerError extends RuntimeException {
    public ServerError(String message) {
        super(message);
    }
}