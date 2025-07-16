package com.learning.api.repositories;

import com.learning.api.entity.Comment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepo extends MongoRepository<Comment, ObjectId> {

    void deleteAllByBlogId(ObjectId blogId);

    void deleteAllByUserId(ObjectId userId);
}
