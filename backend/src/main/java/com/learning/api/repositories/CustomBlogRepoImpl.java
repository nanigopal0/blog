package com.learning.api.repositories;

import com.learning.api.dto.BlogDataDTO;
import com.learning.api.dto.CategoryDTO;
import com.learning.api.entity.Category;
import com.learning.api.exception.BlogNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

@Slf4j
@Repository
public class CustomBlogRepoImpl implements CustomBlogRepo {

    private final MongoTemplate mongoTemplate;

    public CustomBlogRepoImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }


    //find all blogs including user information (BlogDataDTO pojo) with pagination
    @Override
    public Page<BlogDataDTO> findAllBlogsWithUserInfo(Pageable pageable) {

        Aggregation aggregation = Aggregation.newAggregation(
                getBlogToUserLookupOperation(),
                getBlogToCategoryLookupOperation(),
                getBlogToUserProjectionOperation(),
                getFacetOperation(pageable)
        );
        // Fetch paginated results
        Document uniqueMappedResult = mongoTemplate.aggregate(aggregation, "blogs", Document.class).getUniqueMappedResult();
        if (uniqueMappedResult == null) throw new BlogNotFoundException("Blog not found");
        return documentToBlogPage(pageable, uniqueMappedResult);
    }

    // Find blog by blog id including userinfo (BlogDataDTO pojo). The userId is the id of the user who requested the blog
    @Override
    public BlogDataDTO findBlogById(ObjectId blogId, ObjectId userId, Pageable pageable) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("_id").is(blogId)),
                getBlogToUserLookupOperation(),
                getBlogToCommentLookupOperation(pageable),
                getBlogToCategoryLookupOperation(),
                getBlogToBlogReactionLookup(userId),
                getBlogToUserProjectionOperation()
        );
        return mongoTemplate.aggregate(aggregation, "blogs", BlogDataDTO.class).getUniqueMappedResult();
    }

    // Find all blogs with corresponds to user info (BlogDataDTO pojo) by specific category with pagination
    @Override
    public Page<BlogDataDTO> findBlogsByCategory(ObjectId categoryId, Pageable pageable) {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("categoryId").is(categoryId)),
                getBlogToUserLookupOperation(),
                getBlogToUserProjectionOperation(),
                getFacetOperation(pageable)
        );
        Document uniqueMappedResult = mongoTemplate.aggregate(aggregation, "blogs", Document.class).getUniqueMappedResult();
        if (uniqueMappedResult == null) throw new BlogNotFoundException();
        return documentToBlogPage(pageable, uniqueMappedResult);
    }

    // Find all blogs (List of BlogData) created by the specific user by taking user id and return the page
    @Override
    public Page<BlogDataDTO> findBlogsByUserId(ObjectId userid, Pageable pageable) {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").is(userid)),
                getBlogToCategoryLookupOperation(),
                getBlogToUserProjectionOperation(),
                getFacetOperation(pageable)
        );
        Document result = mongoTemplate.aggregate(aggregation, "blogs", Document.class).getUniqueMappedResult();
        if (result == null) throw new BlogNotFoundException("Blog not found");
        return documentToBlogPage(pageable, result);
    }


    // Search all blogs whose title starts with the keyword and return the page of blogs corresponding with user info (BlogDataDTO pojo)
    @Override
    public Page<BlogDataDTO> searchBlogsByTitle(String keyword, Pageable pageable) {
        String regexPattern = "^" + Pattern.quote(keyword);  // Starts with 'keyword'

        MatchOperation match = Aggregation.match(Criteria.where("title").regex(regexPattern, "i")); // Case-insensitive

        Aggregation aggregation = Aggregation.newAggregation(
                match,
                getBlogToUserLookupOperation(),
                getBlogToCategoryLookupOperation(),
                getBlogToUserProjectionOperation(),
                getFacetOperation(pageable)
        );
        Document uniqueMappedResult = mongoTemplate.aggregate(aggregation, "blogs", Document.class).getUniqueMappedResult();
        if (uniqueMappedResult == null) throw new BlogNotFoundException();
        return documentToBlogPage(pageable, uniqueMappedResult);
    }

    // Return Facet operation containing the total blogs and the blogs
    private FacetOperation getFacetOperation(Pageable pageable) {
        return Aggregation.facet()
                .and(
                        Aggregation.sort(pageable.getSort()),
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize())
                ).as("data").and(
                        Aggregation.count().as("totalBlogs")
                ).as("count");
    }

    // Convert the document returned by the mongoTemplate to Page of BlogDataDTO
    private Page<BlogDataDTO> documentToBlogPage(Pageable pageable, Document uniqueMappedResult) {
        List<Document> blogDocuments = uniqueMappedResult.getList("data", Document.class, new ArrayList<>());
        List<Document> count = uniqueMappedResult.getList("count", Document.class, new ArrayList<>());
        if (count == null || count.isEmpty() || blogDocuments == null || blogDocuments.isEmpty())
            throw new BlogNotFoundException();

        List<BlogDataDTO> blogs = blogDocuments.stream().map(doc -> {
            BlogDataDTO blog = BlogDataDTO.builder()
                    .id(doc.getObjectId("_id").toHexString())
                    .title(doc.getString("title"))
                    .coverImage(doc.getString("coverImage"))
                    .content(doc.getString("content"))
                    .time(toLocalDateTime(doc.getDate("time")))
                    .userId(doc.getObjectId("userId") == null ? null : doc.getObjectId("userId").toHexString())
                    .userFullName(doc.getString("userFullName"))
                    .username(doc.getString("username"))
                    .userPhoto(doc.getString("userPhoto"))
                    .build();
            try {
                Category category = mongoTemplate.getConverter().read(Category.class, doc.get("category", Document.class));
                blog.setCategory(CategoryDTO.builder().id(category.getId().toHexString()).category(category.getCategory()).build());
            } catch (Exception e) {
                log.error(e.getMessage());
            }
            return blog;
        }).toList();

        long totalBlogs = count.isEmpty() ? 0 : count.getFirst().getInteger("totalBlogs", 0);
        return new PageImpl<>(blogs, pageable, totalBlogs);
    }

    private LocalDateTime toLocalDateTime(Date date) {
        return date == null ? null : LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }

    //Lookup operation mapped with users collection by id
    private LookupOperation getBlogToUserLookupOperation() {
        return Aggregation.lookup("users", "userId", "_id", "user_details");
    }


    private AggregationOperation getBlogToBlogReactionLookup(ObjectId userId) {
        Document lookup = new Document("$lookup", new Document()
                .append("from", "blog_reaction")
                .append("let", new Document()
                        .append("id", "$_id")
                        .append("userId", userId)
                )
                .append("pipeline", List.of(
                        new Document("$match", new Document("$expr",
                                new Document("$eq", List.of("$blogId", "$$id"))
                        )),
                        new Document("$group", new Document()
                                .append("_id", null)
                                .append("totalLikes", new Document("$sum", 1))
                                .append("userReactionIds", new Document("$push", new Document("$cond", List.of(
                                        new Document("$eq", List.of("$userId", "$$userId")),
                                        "$_id",
                                        "$$REMOVE"
                                ))))
                        ),
                        new Document("$project", new Document()
                                .append("_id", 0)
                                .append("reactionId", new Document("$arrayElemAt", List.of("$userReactionIds", 0)))
                                .append("totalLikes", 1)
                                .append("isUserLiked", new Document("$gt", List.of(
                                        new Document("$size", "$userReactionIds"), 0
                                )))
                        )
                ))
                .append("as", "reaction")
        );
        return new CustomAggregationOperation(lookup);
    }


    private LookupOperation getBlogToCommentLookupOperation(Pageable pageable) {
        return LookupOperation.newLookup().from("comments")
                .let(VariableOperators.Let.ExpressionVariable.newVariable("id").forField("_id"))
                .pipeline(
                        Aggregation.match(
                                Criteria.expr(ComparisonOperators.Eq.valueOf("blogId").equalTo("$$id"))),
                        getBlogToUserLookupOperation(),
                        Aggregation.unwind("user_details"),
                        Aggregation.sort(pageable.getSort()),
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize()),
                        Aggregation.project("userId", "blogId", "comment", "commentedAt")
                                .and("user_details.name").as("userFullName")
                                .and("user_details.photo").as("userPhoto")
                ).as("comments");
    }

    private LookupOperation getBlogToCategoryLookupOperation() {
        return Aggregation.lookup("categories", "categoryId", "_id", "category_details");
    }

    // Return the field as BlogDataDTO contains from the mongodb result
    private ProjectionOperation getBlogToUserProjectionOperation() {
        return Aggregation.project("title", "coverImage", "content", "time", "userId", "comments")
                .and(ArrayOperators.ArrayElemAt.arrayOf("user_details._id").elementAt(0)).as("userId")
                .and(ArrayOperators.ArrayElemAt.arrayOf("user_details.name").elementAt(0)).as("userFullName")
                .and(ArrayOperators.ArrayElemAt.arrayOf("user_details.username").elementAt(0)).as("username")
                .and(ArrayOperators.ArrayElemAt.arrayOf("user_details.photo").elementAt(0)).as("userPhoto")
                .and(ArrayOperators.ArrayElemAt.arrayOf("category_details").elementAt(0)).as("category")
                .and(ConditionalOperators.ifNull(ArrayOperators.ArrayElemAt.arrayOf("reaction").elementAt(0)).then(null))
                .as("reaction");
    }

}
