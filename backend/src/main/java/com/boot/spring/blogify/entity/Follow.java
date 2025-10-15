package com.boot.spring.blogify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
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
}
