package com.learning.api.dto;

import lombok.*;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO extends BaseUserDTO {
    private List<BlogDataDTO> blogs;
}
