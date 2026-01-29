package com.boot.spring.blogify.entity.user;

import com.boot.spring.blogify.dto.auth.Role;
import com.boot.spring.blogify.entity.auth.AuthMode;
import com.boot.spring.blogify.entity.blog.BlogData;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Objects;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users",
        indexes = {
                @Index(name = "username_index", columnList = "username"),
                @Index(name = "email_index", columnList = "email")
        })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String photo;

    @JoinColumn(name = "default_auth_mode", unique = true)
    @OneToOne
    private AuthMode defaultAuthMode;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, name = "is_user_verified")
    private boolean userVerified = false;

    @Column(length = 1000)
    private String bio;

    private String refreshToken;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user", orphanRemoval = true)
    private List<BlogData> blogs;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", photo='" + photo + '\'' +
                ", username='" + username + '\'' +
                ", role=" + role +
                ", defaultAuthMode=" + (defaultAuthMode != null ? defaultAuthMode.getId() : "null") +
                ", email='" + email + '\'' +
                ", userVerified=" + userVerified +
                '}';
    }

}
