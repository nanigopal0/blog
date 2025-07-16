package com.learning.api.repositories;

import com.learning.api.entity.BlogData;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BlogRepo extends MongoRepository<BlogData, ObjectId>, CustomBlogRepo {
    Optional<List<BlogData>> findAllByTitleContainingOrderByTimeDesc(String title);

//    List<BlogData> findAllByCategory(String category);

    Page<BlogData> findAllByUserId(ObjectId userId, Pageable pageable);

    void deleteAllByUserId(ObjectId userId);
}
