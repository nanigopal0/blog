package com.boot.spring.blogify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users",
        indexes = {
                @Index(name = "username_index", columnList = "username"),
                @Index(name = "email_index", columnList = "email")
        })
public class User extends BaseUser {

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user", orphanRemoval = true)
    private List<BlogData> blogs;

    @Column(length = 1000)
    private String bio;

    private String refreshToken;
    /**
     * One user have many follow records when the user is itself a followed
     *
     * Corresponding ManyToMany relationship is
     * @ManyToMany
     * @JoinTable(
     *        name = "user_followers",
     * 	    joinColumns = @JoinColumn(name = "followed_id"),
     * 	    inverseJoinColumns = @JoinColumn(name = "follower_id")
     * )
     * private List<User> followers;
     *
     * Corresponding OneToMany relationship is
     *      @OneToMany(mappedBy = "followed",cascade = CascadeType.ALL)
     *      private List<Follow> followers = new ArrayList<>();
     */

    /**
     * One user have many follow records when the user is itself a follower
     *
     * Corresponding ManyToMany relationship is
     * @ManyToMany(mappedBy = "followers")
     * private List<User> followings;
     *
     * Corresponding OneToMany relationship is
     *    @OneToMany(mappedBy = "follower")
     *    private List<Follow> followings = new ArrayList<>();
     */

}
