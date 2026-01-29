package com.boot.spring.blogify.entity.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_followers",
        uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "followed_id"})
)
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many follow records have exactly one user (follower)
     */
    @ManyToOne()
    @JoinColumn(name = "follower_id")
    private User follower;


    /**
     * Many follow records have exactly one user (followed)
     */
    @ManyToOne
    @JoinColumn(name = "followed_id")
    private User followed;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Follow{");
        sb.append("id=").append(id);
        sb.append('}');
        return sb.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Follow follow)) return false;
        return Objects.equals(id, follow.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
