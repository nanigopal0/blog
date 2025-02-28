import { extractParagraphs } from "./ExtractParagraphs";

export const sortAndFormatDates = (fetchBlogs) => {

    return fetchBlogs
      .sort((a,b)=> new Date(b.blog.time)- new Date(a.blog.time))
      .map(blog => {
        const date = new Date(blog.blog.time);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const content = extractParagraphs(blog.blog.content);

        return {
          id: blog.blog.id,
          coverImage: blog.blog.coverImage,
          title: blog.blog.title,
          content: content,
          userImage: blog.userPhoto,
          username: blog.userName,
          date: date.toLocaleDateString('en-US', options)
        };
      });
  };
