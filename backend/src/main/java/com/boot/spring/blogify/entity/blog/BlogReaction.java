package com.boot.spring.blogify.entity.blog;

import com.boot.spring.blogify.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "blog_reactions", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "blog_id"}))
public class BlogReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  //Which user does like?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private BlogData blog;  //Where the user likes


    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        BlogReaction that = (BlogReaction) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public String toString() {
        return "BlogReaction{" + "id=" + id +
                '}';
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

//userId and blogId both will not be the same in two or more documents