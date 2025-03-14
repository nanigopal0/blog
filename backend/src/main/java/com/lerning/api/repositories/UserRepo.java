package com.lerning.api.repositories;

import com.lerning.api.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepo extends MongoRepository<User, String> {


    Optional<User> findByEmail(String email);

    Optional<List<User>> findAllByName(String name);
}
