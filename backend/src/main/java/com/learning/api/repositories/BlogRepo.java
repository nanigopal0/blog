package com.learning.api.repositories;

import com.learning.api.entity.BlogData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BlogRepo extends MongoRepository<BlogData, String> {
    Optional<List<BlogData>> findAllByTitleContainingOrderByTimeDesc(String title);

    List<BlogData> findAllByCategory(String category);

}
