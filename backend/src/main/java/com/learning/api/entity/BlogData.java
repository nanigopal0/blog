package com.learning.api.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "blogs", indexes =
@Index(name = "title_idx", columnList = "title")
)
public class BlogData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String coverImage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false, name = "category_id")
    @ToString.Exclude
    private Category category;

    @Column(nullable = false)
    private LocalDateTime time;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false, name = "user_id")
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @ToString.Exclude
    private List<Comment> comments;

}
