package com.learning.api.repositories;

import com.learning.api.entity.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepo extends MongoRepository<User, ObjectId> {


    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<List<User>> findAllByName(String name);
}
