package com.boot.spring.blogify.util;

import com.boot.spring.blogify.dto.*;
import com.boot.spring.blogify.entity.BlogData;
import com.boot.spring.blogify.entity.Category;
import com.boot.spring.blogify.entity.Comment;
import com.boot.spring.blogify.entity.User;
import org.springframework.stereotype.Component;

@Component
public class EntityToDTO {

    public CommentDTO convertCommentToCommentDTO(Comment comment, User user, Long blogId) {
        return CommentDTO.builder()
                .commentedAt(comment.getCommentedAt())
                .blogId(blogId)
                .id(comment.getCommentId())
                .comment(comment.getComment())
                .userPhoto(user.getPhoto())
                .userFullName(user.getName())
                .userId(user.getId())
                .build();
    }

    public BlogDataDTO convertBlogDataToBlogDataDTO(BlogData blog, BlogReactionResponseDTO reaction) {
        return BlogDataDTO.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .coverImage(blog.getCoverImage())
                .content(blog.getContent())
                .category(convertCategoryToCategoryDTO(blog.getCategory()))
                .userId(blog.getUser().getId())
                .userFullName(blog.getUser().getName())
                .userPhoto(blog.getUser().getPhoto())
                .username(blog.getUser().getUsername())
                .time(blog.getTime())
                .reaction(reaction)
                .comments(blog.getComments().stream().map(comment ->
                        convertCommentToCommentDTO(comment, comment.getUser(), blog.getId())).toList())
                .build();
    }

    public CategoryDTO convertCategoryToCategoryDTO(Category category) {
        return new CategoryDTO() {
            @Override
            public Long getId() {
                return category.getId();
            }

            @Override
            public String getCategory() {
                return category.getCategory();
            }
        };
    }

    public CurrentUserResponseDTO convertUserToCurrentUserResponseDTO(User user, Long totalFollowings, Long totalFollowers, Long totalBlogs) {
        CurrentUserResponseDTO currentUserResponseDTO = new CurrentUserResponseDTO();
        currentUserResponseDTO.setId(user.getId());
        currentUserResponseDTO.setEmail(user.getEmail());
        currentUserResponseDTO.setUsername(user.getUsername());
        currentUserResponseDTO.setPhoto(user.getPhoto());
        currentUserResponseDTO.setName(user.getName());
        currentUserResponseDTO.setRole(user.getRole());
        currentUserResponseDTO.setTotalFollowings(totalFollowings);
        currentUserResponseDTO.setTotalFollowers(totalFollowers);
        currentUserResponseDTO.setTotalBlogs(totalBlogs);
        currentUserResponseDTO.setBio(user.getBio());
        return currentUserResponseDTO;
    }


    public UserDTO convertUserToUserDTO(User user, Long totalBlogs, Long totalFollowings, Long totalFollowers) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .photo(user.getPhoto())
                .username(user.getUsername())
                .totalFollowings(totalFollowings)
                .totalFollowers(totalFollowers)
                .totalBlogs(totalBlogs)
                .build();
    }
}
