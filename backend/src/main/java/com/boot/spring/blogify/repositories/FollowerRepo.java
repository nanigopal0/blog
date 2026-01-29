package com.boot.spring.blogify.repositories;

import com.boot.spring.blogify.dto.FollowOverviewDTO;
import com.boot.spring.blogify.dto.user.UserOverviewDTO;
import com.boot.spring.blogify.entity.user.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowerRepo extends JpaRepository<Follow, Long> {

    Integer deleteFollowByFollower_IdAndFollowed_Id(Long followerId, Long followedId);

    void deleteAllByFollowed_Id(Long followedId);

    void deleteAllByFollower_Id(Long followerId);

    @Query("""
            SELECT new com.boot.spring.blogify.dto.user.UserOverviewDTO(f.follower.id, f.follower.name, f.follower.photo)
            FROM Follow f JOIN f.follower WHERE f.followed.id = :followedId
            """)
    Page<UserOverviewDTO> findByFollowed_Id(Long followedId, Pageable pageable);

    @Query("""
            SELECT new com.boot.spring.blogify.dto.user.UserOverviewDTO(f.followed.id, f.followed.name, f.followed.photo)
            FROM Follow f JOIN f.followed WHERE f.follower.id = :followerId
            """)
    Page<UserOverviewDTO> findByFollower_Id(Long followerId, Pageable pageable);

    @Query(value = """
                SELECT new com.boot.spring.blogify.dto.FollowOverviewDTO(
                     CASE WHEN COUNT (f) > 0 THEN TRUE ELSE FALSE END ,
                    (SELECT COUNT(f1) FROM Follow f1 WHERE f1.followed.id = :followedId),
                    (SELECT COUNT(f2) FROM Follow f2 WHERE f2.follower.id = :followedId)
                ) FROM Follow f WHERE f.followed.id = :followedId AND f.follower.id = :userId
            """)
    FollowOverviewDTO existsFollowByFollowedIdAndUserId(Long followedId, Long userId);

    Long countFollowByFollowed_Id(Long followedId);

    Long countFollowByFollower_Id(Long followerId);

    @Modifying
    @Query(value = "INSERT INTO user_followers (followed_id, follower_id) VALUES (:followedId,:userId)",
            nativeQuery = true)
    void saveFollow(Long followedId, Long userId);

//    @Modifying
//    @Query(value = "DELETE FROM user_followers WHERE followed_id=:followedId AND follower_id=:userId",
//            nativeQuery = true)
//    void deleteFollow(Long followedId, Long userId);
}
