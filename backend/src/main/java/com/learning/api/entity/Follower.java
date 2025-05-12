package com.learning.api.entity;

import lombok.*;
import org.bson.types.ObjectId;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Follower {
    private ObjectId followerId;
}
