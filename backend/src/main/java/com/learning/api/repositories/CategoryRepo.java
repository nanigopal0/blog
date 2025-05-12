package com.learning.api.repositories;

import com.learning.api.entity.Category;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryRepo extends MongoRepository<Category, ObjectId> {
    List<Category> findByCategoryStartsWith(String category);
}
