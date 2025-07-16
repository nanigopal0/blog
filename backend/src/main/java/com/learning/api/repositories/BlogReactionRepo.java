package com.learning.api.repositories;

import com.learning.api.entity.BlogReaction;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BlogReactionRepo extends MongoRepository<BlogReaction, ObjectId> {
}
