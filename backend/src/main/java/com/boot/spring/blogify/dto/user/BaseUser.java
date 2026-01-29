package com.boot.spring.blogify.dto.user;

import com.boot.spring.blogify.dto.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
//@MappedSuperclass
public class BaseUser {
    //    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //    @Column(nullable = false)
    private String name;

    private String photo;

    //    @Column(nullable = false, unique = true)
    private String username;

    //    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    //    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
    private Role role;

    //    @Column(nullable = false, name = "isUserVerified")
    private boolean userVerified = false;
}
