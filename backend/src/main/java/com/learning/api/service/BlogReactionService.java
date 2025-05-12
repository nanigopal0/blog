package com.learning.api.service;

import com.learning.api.dto.BlogReactionRequestDTO;
import org.bson.types.ObjectId;

public interface BlogReactionService {
    String like(BlogReactionRequestDTO blogLike);

    String disLike(ObjectId blogReactionId);
}
