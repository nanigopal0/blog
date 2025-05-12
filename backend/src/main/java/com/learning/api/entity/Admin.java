package com.learning.api.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;


@EqualsAndHashCode(callSuper = false)
@Data
@NoArgsConstructor
//@AllArgsConstructor
@Document(collection = "admins")
public class Admin extends BaseUser {

}
