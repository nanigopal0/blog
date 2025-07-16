import { extractParagraphs } from "./ExtractParagraphs";
import FormatDate from "./FormatDate";

export const sortAndFormatDates = (fetchBlogs) => {

    return fetchBlogs
      .sort((a,b)=> new Date(b.time)- new Date(a.time))
      .map(blog => {
        const content = extractParagraphs(blog.content);

        return {
          id: blog.id,
          coverImage: blog.coverImage,
          title: blog.title,
          content: content,
          userImage: blog.user.photo,
          username: blog.username,
          userFullName: blog.user.name,
          userId: blog.user.id,
          date: FormatDate(blog.time)
        };
      });
  };
