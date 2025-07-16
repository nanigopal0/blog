import { useEffect, useState } from "react";


export function Demo(props){

    const [blogs, setBlogs] = useState([]);

    function extractParagraphs(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const paragraphs = doc.querySelectorAll('p');
      
      // Filter out paragraphs that contain images
      const filteredParagraphs = Array.from(paragraphs)
        .filter(p => !p.querySelector('img'))
        .map(p => p.outerHTML)
        .join('');
      return filteredParagraphs;
    }
    
  
    useEffect(()=>{
      const sortAndFormatDates = () => {
     
        return props.data 
          .sort((a, b) => new Date(b.blog.time) - new Date(a.blog.time))
          .map(blog => {
            const date = new Date(blog.blog.time);
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const content = extractParagraphs(blog.blog.content);
  
            return {id: blog.blog.id,
                coverImage: blog.blog.coverImage,
                title: blog.blog.title,
                content: content,
                userImage: blog.userPhoto,
                username: blog.userName,
                date: date.toLocaleDateString('en-US', options)
            };
          });
      }
      
      setBlogs(sortAndFormatDates() );
    },[]);
return blogs;
}

