package com.boot.spring.blogify.controller;

import com.boot.spring.blogify.dto.FollowOverviewDTO;
import com.boot.spring.blogify.dto.FollowResponseDTO;
import com.boot.spring.blogify.dto.user.UserOverviewDTO;
import com.boot.spring.blogify.service.FollowerService;
import org.springframework.data.web.PagedModel;
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
    public FollowResponseDTO follow(@RequestParam Long followedId) {
        return followerService.follow(followedId);
    }

    @DeleteMapping("unfollow")
    public FollowResponseDTO unfollow(@RequestParam Long followedId) {
        return followerService.unfollow(followedId);
    }

    @GetMapping("get")
    public FollowOverviewDTO getFollowInfo(@RequestParam Long followedId) {
        return followerService.getFollowInfo( followedId);
    }

    @GetMapping("get-followers")
    public ResponseEntity<PagedModel<UserOverviewDTO>> getFollowers(
            @RequestParam Long userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(followerService.getAllFollowers(userId,pageNumber, pageSize));
    }

    @GetMapping("get-followings")
    public ResponseEntity<PagedModel<UserOverviewDTO>> getFollowings(
            @RequestParam Long userId,
            @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(followerService.getAllFollowings(userId, pageNumber, pageSize));
    }

}
