package com.boot.spring.blogify.entity.auth;

import com.boot.spring.blogify.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "auth_mode",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"provider_user_id", "provider_id"}),
                @UniqueConstraint(columnNames = {"user_id", "provider_id"})
        }
)
public class AuthMode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_user_id")
    private String providerUserId;

    @JoinColumn(nullable = false, name = "provider_id")
    @ManyToOne
    private AuthProvider provider;

    @JoinColumn(nullable = false, name = "user_id")
    @ManyToOne
    private User user;

    @Column(nullable = false, name = "linked_at")
    private LocalDateTime linkedAt;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        AuthMode authMode = (AuthMode) o;
        return Objects.equals(id, authMode.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "AuthMode{" +
                "id=" + id +
                ", providerUserId='" + providerUserId + '\'' +
                ", provider=" + (provider != null ? provider.getId() : "null") +
                ", linkedAt=" + linkedAt +
                '}';
    }

}
