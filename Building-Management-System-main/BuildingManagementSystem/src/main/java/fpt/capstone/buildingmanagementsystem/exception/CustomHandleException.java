package fpt.capstone.buildingmanagementsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomHandleException {
    @ExceptionHandler(ServerError.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessage internalServerError(Exception exception) {
        return new ErrorMessage("500", exception.getMessage());
    }

    @ExceptionHandler(BadRequest.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessage badRequest(Exception exception) {
        return new ErrorMessage("400", exception.getMessage());
    }

    @ExceptionHandler(NotFound.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorMessage notfound(Exception exception) {
        return new ErrorMessage("404", exception.getMessage());
    }

    @ExceptionHandler(ForbiddenError.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorMessage forbiddenError(Exception exception) {
        return new ErrorMessage("403", exception.getMessage());
    }
    @ExceptionHandler(Conflict.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorMessage conflict(Exception exception) {
        return new ErrorMessage("409", exception.getMessage());
    }
    @ExceptionHandler(UnprocessableEntity.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorMessage unprocessableEntity(Exception exception) {
        return new ErrorMessage("422", exception.getMessage());
    }
}