package com.boot.spring.blogify.entity.otp;

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
@Table(name = "OTP")
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 6)
    private String otp;

    @JoinColumn(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isVerified;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Reason reason;

    @Override
    public String toString() {
        return "OTP{" + "id=" + id +
                ", otp='" + otp + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                ", isVerified=" + isVerified +
                ", reason=" + reason +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof OTP otp1)) return false;
        return Objects.equals(id, otp1.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
