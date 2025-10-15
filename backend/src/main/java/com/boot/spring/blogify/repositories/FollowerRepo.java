package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.UserOverviewDTO;
import com.boot.spring.blogify.entity.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowerRepo extends JpaRepository<Follow, Long> {

    void deleteFollowByFollower_IdAndFollowed_Id(Long followerId, Long followedId);

    void deleteAllByFollowed_Id(Long followedId);

    void deleteAllByFollower_Id(Long followerId);

    @Query("""
                    SELECT f.follower.id AS id, f.follower.name AS name, f.follower.photo AS photo
                                FROM Follow f WHERE f.followed.id =:followedId
            """)
    Page<UserOverviewDTO> findByFollowed_Id(Long followedId, Pageable pageable);

    @Query("""
                SELECT f.followed.id AS id, f.followed.name AS name, f.followed.photo AS photo
                             FROM Follow f WHERE f.follower.id =:followerId
            """)
    Page<UserOverviewDTO> findByFollower_Id(Long followerId, Pageable pageable);

    Boolean existsFollowByFollowedIdAndFollowerId(Long followedId, Long followerId);

    Long countFollowByFollowed_Id(Long followedId);

    Long countFollowByFollower_Id(Long followerId);
}
