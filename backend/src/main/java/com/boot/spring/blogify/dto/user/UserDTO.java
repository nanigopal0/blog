package com.boot.spring.blogify.dto.user;

import com.boot.spring.blogify.dto.auth.Role;
import lombok.*;

import java.util.Objects;

@Getter
@Setter
public class UserDTO extends BasicUserInfo {
    private String defaultAuthProvider;
    private String email;
    private Long totalBlogs;
    private Long totalFollowers;
    private Long totalFollowings;

    public UserDTO(Long id, String name, String photo, Role role, boolean userVerified, String username, String bio,
                   String defaultAuthProvider, String email, Long totalBlogs, Long totalFollowers, Long totalFollowings
    ) {
        super(id, name, photo, role.name(), userVerified, username, bio);
        this.defaultAuthProvider = defaultAuthProvider;
        this.email = email;
        this.totalBlogs = totalBlogs;
        this.totalFollowers = totalFollowers;
        this.totalFollowings = totalFollowings;
    }

    @Override
    public String toString() {
        return "UserDTO{" + "defaultAuthProvider='" + defaultAuthProvider + '\'' +
                ", email='" + email + '\'' +
                ", bio='" + getBio() + '\'' +
                ", id=" + getId() +
                ", username='" + getUsername() + '\'' +
                ", photo='" + getPhoto() + '\'' +
                ", name='" + getName() + '\'' +
                ", role=" + getRole() +
                ", userVerified=" + isUserVerified() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        UserDTO userDTO = (UserDTO) o;
        return Objects.equals(defaultAuthProvider, userDTO.defaultAuthProvider)
                && Objects.equals(email, userDTO.email)
                && Objects.equals(getBio(), userDTO.getBio())
                && Objects.equals(getId(), userDTO.getId())
                && Objects.equals(getUsername(), userDTO.getUsername())
                && Objects.equals(getPhoto(), userDTO.getPhoto())
                && Objects.equals(getName(), userDTO.getName())
                && Objects.equals(getRole(), userDTO.getRole())
                && Objects.equals(isUserVerified(), userDTO.isUserVerified());

    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), email, getId(), getUsername());
    }
}
