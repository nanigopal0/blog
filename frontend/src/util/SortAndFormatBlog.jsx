import { extractParagraphs } from "./ExtractParagraphs";

export const sortAndFormatDates = (fetchBlogs) => {

    return fetchBlogs
      .sort((a,b)=> new Date(b.time)- new Date(a.time))
      .map(blog => {
        const date = new Date(blog.time);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
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
          date: date.toLocaleDateString('en-US', options)
        };
      });
  };
