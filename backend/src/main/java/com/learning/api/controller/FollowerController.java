package com.learning.api.controller;

import com.learning.api.dto.UserOverviewDTO;
import com.learning.api.service.FollowerService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("follower")
public class FollowerController {

    private final FollowerService followerService;

    public FollowerController(FollowerService followerService) {
        this.followerService = followerService;
    }

    @PostMapping("follow")
    public ResponseEntity<String> follow(@RequestParam Long userId) {
        followerService.follow(userId);
        return ResponseEntity.ok().body(userId + " followed successfully ");
    }

    @DeleteMapping("unfollow")
    public ResponseEntity<String> unfollow(@RequestParam Long followedId) {
        followerService.unfollow(followedId);
        return ResponseEntity.ok().body(followedId + " unfollow successfully!");
    }

    @GetMapping("is-follows")
    public ResponseEntity<Boolean> isFollowing(@RequestParam Long userId, @RequestParam Long followedId) {
        return ResponseEntity.ok(followerService.isFollowing(userId, followedId));
    }

    @GetMapping("get-followers")
    public ResponseEntity<Page<UserOverviewDTO>> getFollowers(
            @RequestParam Long userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortOrder", defaultValue = "asc", required = false) String sortOrder,
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy

    ) {
        return ResponseEntity.ok(followerService.getAllFollowers(userId, sortBy, sortOrder, pageNumber, pageSize));
    }

    @GetMapping("get-followings")
    public ResponseEntity<Page<UserOverviewDTO>> getFollowings(
            @RequestParam Long userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortOrder", defaultValue = "asc", required = false) String sortOrder,
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy
    ) {
        return ResponseEntity.ok(followerService.getAllFollowings(userId, sortBy, sortOrder, pageNumber, pageSize));
    }

}
