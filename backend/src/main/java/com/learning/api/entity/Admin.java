package com.learning.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;


@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@Entity
@Table(
        name = "admins",
        indexes = {
                @Index(name = "username_index", columnList = "username"),
                @Index(name = "email_index", columnList = "email")
        })
public class Admin extends BaseUser {

}
