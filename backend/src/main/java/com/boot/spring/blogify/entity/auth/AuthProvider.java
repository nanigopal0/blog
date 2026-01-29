package com.boot.spring.blogify.entity.auth;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "auth_provider")
public class AuthProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,length = 50,name = "provider_name")
    private String providerName;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof AuthProvider that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(providerName, that.providerName);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("AuthProvider{");
        sb.append("id=").append(id);
        sb.append(", providerName='").append(providerName).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
