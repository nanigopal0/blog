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
@Table(name = "blog_reactions", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "blog_id"}))
public class BlogReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  //Which user does like

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private BlogData blog;  //Where the user likes
}

//userId and blogId both will not be the same in two or more documents