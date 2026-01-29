package com.boot.spring.blogify.entity.blog;


import com.boot.spring.blogify.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private BlogData blog;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime commentedAt;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Comment comment1)) return false;
        return Objects.equals(commentId, comment1.commentId) && Objects.equals(comment, comment1.comment) && Objects.equals(commentedAt, comment1.commentedAt);
    }

    @Override
    public String toString() {
        return "Comment{" + "commentId=" + commentId +
                ", comment='" + comment + '\'' +
                ", commentedAt=" + commentedAt +
                '}';
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
