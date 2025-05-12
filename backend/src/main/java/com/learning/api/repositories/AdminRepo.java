package com.learning.api.repositories;

import com.learning.api.entity.Admin;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminRepo extends MongoRepository<Admin, ObjectId> {
    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByUsername(String username);
}
