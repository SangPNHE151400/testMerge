package fpt.capstone.buildingmanagementsystem.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.Conflict;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.request.*;
import fpt.capstone.buildingmanagementsystem.model.response.*;
import fpt.capstone.buildingmanagementsystem.repository.*;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LiveChatService {
    @Autowired
    ChatMessageRepository chatMessageRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ChatUserRepository chatUserRepository;
    @Autowired
    ChatRepository chatRepository;
    @Autowired
    UnReadChatRepository unReadChatRepository;

    @Transactional
    public ListChatResponse createChat(CreateChatRequest createChatRequest) {
        try {
            if (createChatRequest.getFrom() != null
                    && createChatRequest.getMessage() != null
                    && createChatRequest.getTo() != null) {
                List<User> to = userRepository.findAllByUserIdIn(createChatRequest.getTo());
                Optional<User> from = userRepository.findByUserId(createChatRequest.getFrom());
                String isGroupChat = "true";
                String chatName = null;
                if (to.size() > 0 && from.isPresent()) {
                    Chat chat;
                    List<ChatUser> chatUsers = new ArrayList<>();
                    if (to.size() == 1) {
                        chat = Chat.builder().chatName(null).isGroupChat(false).createAt(Until.generateRealTime()).updateAt(Until.generateRealTime()).build();
                        chatUsers.add(ChatUser.builder().user(to.get(0)).chat(chat).build());
                        isGroupChat = "false";
                        chatName = to.get(0).getAccount().getUsername();
                    } else {
                        chat = Chat.builder().chatName(createChatRequest.getChatName()).isGroupChat(true)
                                .createAt(Until.generateRealTime()).updateAt(Until.generateRealTime()).build();
                        chatName = createChatRequest.getChatName();
                        for (User elementTo : to) {
                            chatUsers.add(ChatUser.builder().user(elementTo).chat(chat).build());
                        }
                    }
                    chat.setCreatedBy(from.get().getUserId());
                    chatUsers.add(ChatUser.builder().user(from.get()).chat(chat).build());
                    Chat chatResponse = chatRepository.saveAndFlush(chat);
                    chatUserRepository.saveAll(chatUsers);
                    ChatMessage chatMessage = ChatMessage.builder()
                            .sender(from.get())
                            .message(createChatRequest.getMessage())
                            .createAt(Until.generateRealTime())
                            .updateAt(Until.generateRealTime())
                            .chat(chat)
                            .type("text")
                            .build();
                    chatMessageRepository.save(chatMessage);
                    List<UnReadChat> list = new ArrayList<>();
                    for (User elementTo : to) {
                        UnReadChat unReadChat = UnReadChat.builder().chat(chat).user(elementTo).build();
                        list.add(unReadChat);
                    }
                    unReadChatRepository.saveAll(list);
                    List<String> avatarLists = new ArrayList<>();
                    List<UserInfoResponse> userLists = new ArrayList<>();
                    to.forEach(element -> {
                        avatarLists.add(element.getImage());
                        UserInfoResponse userListChatResponse = new UserInfoResponse
                                (element.getUserId(), element.getAccount().getUsername(),
                                        element.getFirstName(),element.getLastName(),element.getImage()
                                        ,element.getAccount().getRole().getRoleName());
                        userLists.add(userListChatResponse);
                    });
                    return ListChatResponse.builder().chatId(chatResponse.getId()).chatName(chatName).admin(createChatRequest.getFrom())
                            .avatar(avatarLists).user(userLists).updateAt(chatResponse.getUpdateAt()).isGroupChat(isGroupChat).read("true").build();
                } else {
                    throw new NotFound("requests_fails");
                }
            } else {
                throw new BadRequest("requests_fails");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public MessageImageAndFileResponse newChatMessage(ChatMessageRequest chatMessageRequest) {
        List<User> to = new ArrayList<>();
        Chat chat = chatRepository.findById(chatMessageRequest.getChatId()).get();
        chatUserRepository.findAllByChat_Id(chatMessageRequest.getChatId()).forEach(element -> {
            if (!Objects.equals(element.getUser().getUserId(), chatMessageRequest.getFrom())) {
                to.add(element.getUser());
            }
        });
        Optional<User> from = userRepository.findByUserId(chatMessageRequest.getFrom());
        ChatMessage chatMessage = ChatMessage.builder()
                .sender(from.get())
                .message(chatMessageRequest.getMessage())
                .createAt(Until.generateRealTime())
                .updateAt(Until.generateRealTime())
                .chat(chat)
                .type("text")
                .build();
        chatMessageRepository.saveAndFlush(chatMessage);
        chat.setUpdateAt(Until.generateRealTime());
        chatRepository.saveAndFlush(chat);
        List<UnReadChat> list = new ArrayList<>();
        for (User elementTo : to) {
            if (!unReadChatRepository.existsUnReadChatByChatAndUser(chat, elementTo)) {
                UnReadChat unReadChat = UnReadChat.builder().chat(chat).user(elementTo).build();
                list.add(unReadChat);
            }
        }
        unReadChatRepository.saveAll(list);
        return MessageImageAndFileResponse.builder().messageId(chatMessage.getId()).senderId(chatMessage.getSender().getUserId()).message(chatMessageRequest.getMessage()).build();
    }

    public MessageImageAndFileResponse newChatMessage2(String data, MultipartFile file) throws IOException {
        ChatMessageRequest2 chatMessageRequest2 = new ObjectMapper().readValue(data, ChatMessageRequest2.class);
        List<User> to = new ArrayList<>();
        Chat chat = chatRepository.findById(chatMessageRequest2.getChatId()).get();
        chatUserRepository.findAllByChat_Id(chatMessageRequest2.getChatId()).forEach(element -> {
            if (!Objects.equals(element.getUser().getUserId(), chatMessageRequest2.getFrom())) {
                to.add(element.getUser());
            }
        });
        Optional<User> from = userRepository.findByUserId(chatMessageRequest2.getFrom());
        String[] subFileName = Objects.requireNonNull(file.getOriginalFilename()).split("\\.");
        List<String> stringList = new ArrayList<>(Arrays.asList(subFileName));
        String name = "livechat_" + UUID.randomUUID() + "." + stringList.get(1);
        Bucket bucket = StorageClient.getInstance().bucket();
        bucket.create(name, file.getBytes(), file.getContentType());

        ChatMessage chatMessage = ChatMessage.builder()
                .sender(from.get())
                .imageName(name).chat(chat)
                .createAt(Until.generateRealTime())
                .updateAt(Until.generateRealTime())
                .type("image")
                .build();
        chatMessageRepository.save(chatMessage);
        chat.setUpdateAt(Until.generateRealTime());
        chatRepository.saveAndFlush(chat);
        List<UnReadChat> list = new ArrayList<>();
        for (User elementTo : to) {
            if (!unReadChatRepository.existsUnReadChatByChatAndUser(chat, elementTo)) {
                UnReadChat unReadChat = UnReadChat.builder().chat(chat).user(elementTo).build();
                list.add(unReadChat);
            }
        }
        unReadChatRepository.saveAll(list);
        return MessageImageAndFileResponse.builder().messageId(chatMessage.getId()).senderId(chatMessage.getSender().getUserId()).message(name).build();
    }

    public MessageImageAndFileResponse newChatMessage3(String data, MultipartFile file) throws IOException {
        ChatMessageRequest2 chatMessageRequest2 = new ObjectMapper().readValue(data, ChatMessageRequest2.class);
        List<User> to = new ArrayList<>();
        Chat chat = chatRepository.findById(chatMessageRequest2.getChatId()).get();
        chatUserRepository.findAllByChat_Id(chatMessageRequest2.getChatId()).forEach(element -> {
            if (!Objects.equals(element.getUser().getUserId(), chatMessageRequest2.getFrom())) {
                to.add(element.getUser());
            }
        });
        Optional<User> from = userRepository.findByUserId(chatMessageRequest2.getFrom());
        ChatMessage chatMessage = ChatMessage.builder()
                .sender(from.get())
                .chat(chat)
                .createAt(Until.generateRealTime())
                .updateAt(Until.generateRealTime())
                .fileName(StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename())))
                .fileType(file.getContentType())
                .file(file.getBytes())
                .type("file")
                .build();
        ChatMessage chatMessage1=chatMessageRepository.saveAndFlush(chatMessage);
        chat.setUpdateAt(Until.generateRealTime());
        chatRepository.saveAndFlush(chat);
        List<UnReadChat> list = new ArrayList<>();
        for (User elementTo : to) {
            if (!unReadChatRepository.existsUnReadChatByChatAndUser(chat, elementTo)) {
                UnReadChat unReadChat = UnReadChat.builder().chat(chat).user(elementTo).build();
                list.add(unReadChat);
            }
        }
        unReadChatRepository.saveAll(list);
        return MessageImageAndFileResponse.builder().senderId(chatMessage1.getSender().getUserId())
                .messageId(chatMessage1.getId()).message(StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()))).build();
    }

    public ChatResponse getMessageBySenderAndReceiver(String chatId, String userId) {
        List<MessageResponse> messageResponses = new ArrayList<>();
        List<UserChatResponse> user = new ArrayList<>();
        List<String> sender_Id= new ArrayList<>();
        List<ChatMessage> chatMessages = chatMessageRepository.findAllByChat_Id(chatId);
        chatMessages = chatMessages.stream()
                .sorted((Comparator.comparing(ChatMessage::getCreateAt)))
                .collect(Collectors.toList());
        List<ChatUser> chatUsers = chatUserRepository.findAllByChat_Id(chatId);
        chatMessages.forEach(chatMessage -> {
            boolean myself = false;
            if (chatMessage.getSender().getUserId().equals(userId)) {
                myself = true;
            }
            String message;
            if (chatMessage.getType().equals("image")) {
                message = chatMessage.getImageName();
            } else if (chatMessage.getType().equals("file")) {
                message = chatMessage.getFileName();
            } else {
                message = chatMessage.getMessage();
            }
            MessageResponse messageResponse = new MessageResponse(chatMessage.getId(), myself, message, chatMessage.getSender().getUserId(),
                    chatMessage.getCreateAt().toString(), chatMessage.getType());
            messageResponses.add(messageResponse);
            sender_Id.add(chatMessage.getSender().getUserId());
        });
        chatUsers.forEach(element -> {
            UserChatResponse userChatResponse = new UserChatResponse(element.getUser().getUserId(), element.getUser().getAccount().getUsername(), element.getUser().getImage());
            user.add(userChatResponse);
        });
        List<User> users=userRepository.findAllByUserIdIn(sender_Id);
        users.forEach(element->{
            if(!chatUserRepository.existsByUserAndChat(element,chatUsers.get(0).getChat())){
                UserChatResponse userChatResponse = new UserChatResponse(element.getUserId(), element.getAccount().getUsername(), element.getImage());
                user.add(userChatResponse);
            }
        });
        return new ChatResponse(messageResponses, user, chatMessages.get(0).getChat().getCreatedBy());
    }

    public List<UserInfoResponse> getAllChatUserSingle(String userId) {
        List<UserInfoResponse> userInfoResponses = new ArrayList<>();
        List<User> userList = userRepository.findAllByAccount_Status_StatusName("active");
        Optional<User> user = userRepository.findByUserId(userId);
        List<ChatUser> chatUserToGetId=chatUserRepository.findAllByUser_UserId(userId);
        List<ChatUser> chatUser = new ArrayList<>();
        for (ChatUser userChat : chatUserToGetId) {
            chatUser.addAll(chatUserRepository.find(userChat.getChat().getId(),userId));
        }
        for (ChatUser userChat : chatUser) {
            if (!userChat.getChat().isGroupChat()) {
                userList.remove(userChat.getUser());
            }
        }
        userList.remove(user.get());
        userList.forEach(element -> {
            UserInfoResponse userInfoResponse = UserInfoResponse.builder().accountId(element.getUserId())
                    .username(element.getAccount().getUsername()).firstName(element.getFirstName()).lastName(element.getLastName()).roleName(element.getAccount().getRole().getRoleName()).build();
            userInfoResponses.add(userInfoResponse);
        });
        return userInfoResponses;
    }

    public List<ListChatResponse> getAllChat(String userId) {
        List<ListChatResponse> listChatResponses = new ArrayList<>();
        List<ChatUser> chatUser = chatUserRepository.findAllByUser_UserId(userId);
        for (ChatUser userChat : chatUser) {
            ListChatResponse listChatResponse = new ListChatResponse();
            List<UserInfoResponse> userLists = new ArrayList<>();
            List<String> avatarLists = new ArrayList<>();
            List<ChatUser> chatUsers2 = chatUserRepository.findAllByChat_Id(userChat.getChat().getId());
            listChatResponse.setChatId(userChat.getChat().getId());
            listChatResponse.setUpdateAt(userChat.getChat().getUpdateAt());
            String chatName = userChat.getChat().getChatName();
            for (ChatUser userChat2 : chatUsers2) {
                if (!Objects.equals(userChat2.getUser().getUserId(), userId)) {
                    avatarLists.add(userChat2.getUser().getImage());
                    UserInfoResponse userListChatResponse = new UserInfoResponse
                            (userChat2.getUser().getUserId(), userChat2.getUser().getAccount().getUsername(),
                                    userChat2.getUser().getFirstName(),userChat2.getUser().getLastName(),userChat2.getUser().getImage()
                                    ,userChat2.getUser().getAccount().getRole().getRoleName());
                    userLists.add(userListChatResponse);
                }
                if (!userChat2.getChat().isGroupChat() && !Objects.equals(userChat2.getUser().getUserId(), userId)) {
                    chatName = userChat2.getUser().getAccount().getUsername();
                }
            }
            String isGroup = "false";
            if (userChat.getChat().isGroupChat()) {
                isGroup = "true";
            }
            String isRead = "true";
            if (unReadChatRepository.existsUnReadChatByChatAndUser(userChat.getChat(), userChat.getUser())) {
                isRead = "false";
            }
            listChatResponse.setIsGroupChat(isGroup);
            listChatResponse.setAvatar(avatarLists);
            listChatResponse.setUser(userLists);
            listChatResponse.setChatName(chatName);
            listChatResponse.setRead(isRead);
            listChatResponse.setAdmin(userChat.getChat().getCreatedBy());
            listChatResponses.add(listChatResponse);
        }
        listChatResponses = listChatResponses.stream()
                .sorted((Comparator.comparing(ListChatResponse::getUpdateAt).reversed()))
                .collect(Collectors.toList());
        return listChatResponses;
    }

    public ListChatResponse updateChat(UpdateGroupChatRequest updateGroupChatRequest) {
        if (updateGroupChatRequest.getIsGroup() != null && updateGroupChatRequest.getChatId() != null &&
                updateGroupChatRequest.getUserId().size() > 0 && updateGroupChatRequest.getIsGroup().equals("true")) {
            Optional<Chat> chatOptional = chatRepository.findById(updateGroupChatRequest.getChatId());
            if (chatOptional.isPresent()) {
                Chat chat = chatOptional.get();
                boolean check = false;
                List<UnReadChat> list = unReadChatRepository.findAllByChat_Id(updateGroupChatRequest.getChatId());
                for (String userId : updateGroupChatRequest.getUserId()) {
                    if (userId.equals(chat.getCreatedBy())) {
                        check = true;
                        break;
                    }
                }
                if (check) {
                    chat.setChatName(updateGroupChatRequest.getChatName());
                    chat.setUpdateAt(Until.generateRealTime());
                    chatRepository.save(chat);
                    unReadChatRepository.deleteAllByChat(chat);
                    chatUserRepository.deleteAllByChat_Id(updateGroupChatRequest.getChatId());
                    List<User> to = userRepository.findAllByUserIdIn(updateGroupChatRequest.getUserId());
                    List<ChatUser> chatUsers = new ArrayList<>();
                    for (User elementTo : to) {
                        chatUsers.add(ChatUser.builder().user(elementTo).chat(chat).build());
                    }
                    chatUserRepository.saveAll(chatUsers);
                    ChatMessageRequest chatMessageRequest= new ChatMessageRequest(chat.getCreatedBy(),chat.getId(),"[AUTO] I have updated the chat group !");
                    newChatMessage(chatMessageRequest);
                    List<String> avatarLists = new ArrayList<>();
                    List<UserInfoResponse> userLists = new ArrayList<>();
                    to.forEach(element -> {
                        avatarLists.add(element.getImage());
                        UserInfoResponse userListChatResponse = new UserInfoResponse
                                (element.getUserId(), element.getAccount().getUsername(),
                                        element.getFirstName(),element.getLastName(),element.getImage()
                                        ,element.getAccount().getRole().getRoleName());
                        userLists.add(userListChatResponse);
                    });
                    return new ListChatResponse(chat.getId(),chat.getChatName(),Boolean.toString(chat.isGroupChat()),avatarLists,
                            userLists,Until.generateRealTime(),"true",chat.getCreatedBy());
                } else {
                    throw new Conflict("admin_not_found_in_list");
                }
            } else {
                throw new NotFound("not_found");
            }
        } else {
            throw new BadRequest("requests_fails");
        }
    }

    public boolean removeFromChat(RemoveUserAndChangeAdminRequest request) {
        if (request.getUserId() != null && request.getChatId() != null) {
            Optional<Chat> chat = chatRepository.findById(request.getChatId());
            Optional<User> user = userRepository.findByUserId(request.getUserId());
            if (chat.isPresent() && user.isPresent() && !Objects.equals(chat.get().getCreatedBy(), request.getUserId())) {
                chatUserRepository.deleteByUserAndChat(user.get(), chat.get());
                unReadChatRepository.deleteByUserAndChat(user.get(), chat.get());
                return true;
            } else {
                throw new BadRequest("requests_fails");
            }
        } else {
            throw new BadRequest("requests_fails");
        }
    }

    public boolean readChat(RemoveUserAndChangeAdminRequest request) {
        if (request.getUserId() != null && request.getChatId() != null) {
            Optional<Chat> chat = chatRepository.findById(request.getChatId());
            Optional<User> user = userRepository.findByUserId(request.getUserId());
            if (chat.isPresent() && user.isPresent()) {
                unReadChatRepository.deleteByUserAndChat(user.get(), chat.get());
                return true;
            } else {
                throw new BadRequest("requests_fails");
            }
        } else {
            throw new BadRequest("requests_fails");
        }
    }

    public boolean updateChange(RemoveUserAndChangeAdminRequest request) {
        if (request.getUserId() != null && request.getChatId() != null) {
            Optional<Chat> chat = chatRepository.findById(request.getChatId());
            if (chat.isPresent()) {
                chat.get().setCreatedBy(request.getUserId());
                chatRepository.save(chat.get());
                return true;
            } else {
                throw new BadRequest("requests_fails");
            }
        } else {
            throw new BadRequest("requests_fails");
        }
    }

    public FileDataResponse getFileChatDownload(FileRequest fileRequest) {
        if (fileRequest.getMessageId() != null && fileRequest.getFileName() != null) {
            Optional<ChatMessage> chatMessage = chatMessageRepository.findByIdAndFileName(fileRequest.getMessageId(), fileRequest.getFileName());
            if (chatMessage.isPresent()) {
                return new FileDataResponse(fileRequest.getMessageId(), chatMessage.get().getFileName(), chatMessage.get().getFileType(), chatMessage.get().getFile());
            } else {
                throw new NotFound("file_not_found");
            }
        } else {
            throw new BadRequest("requests_fails");
        }
    }
}
