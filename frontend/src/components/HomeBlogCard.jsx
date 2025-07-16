import { useNavigate } from "react-router-dom";
import htmlTruncate from 'html-truncate';

function HomeBlogCard({blog}) {
  const navigate = useNavigate();
  
  const navigateReader = (id) => {
    // const data = { isBlogOfCurrentUser: (props.username ? false : true)};
    // navigate(`/blog/${id}`,{state:data});
    navigate(`/blog/${id}`);

  };

  const truncateHtmlContent = (htmlContent, maxLength = 80) => {
    return htmlTruncate(htmlContent, maxLength, { ellipsis: '...' });
  };

  return (
    // <div className=" max-w-sm w-full lg:max-w-full lg:flex mx-2 my-3 p-2 ">
    // {/* <div class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style="background-image: url('/img/card-left.jpg')" title="Woman holding a mug"> */}
    //   {/* </div> */}

    <div
      className=" hover:shadow-gray-600 shadow-md w-full border border-gray-400 overflow-auto rounded-lg"
      onClick={() => navigateReader(blog.id)}
    >
      <div title="cover image">
        <img
          className="h-48 w-full object-cover"
          src={blog.coverImage}
          alt=""
        />
      </div>
      <div className=" bg-white  p-4 flex flex-col justify-between leading-normal">
        <div className="mb-4">
          <div className="text-gray-900 font-bold text-xl mb-2">
            {blog.title}
          </div>
          <div
            className="text-gray-700 text-base"
            dangerouslySetInnerHTML={{ __html: truncateHtmlContent(blog.content) }}
          ></div>
        </div>
        <div className="flex items-center">
          {blog.userPhoto !== "null" ? (
            <img
              className="w-10 h-10 rounded-full mr-4"
              src={`${blog.userPhoto ? blog.userPhoto : "/src/assets/person.svg"}`}
              alt="avatar"
            />
          ) : (
            <> </>
          )}
          <div className="text-sm">
            {blog.userFullName ? (
              <p className="text-gray-900 font-semibold leading-none">
                {blog.userFullName}
              </p>
            ) : (
              <></>
            )}
            <p className="text-gray-600">{blog.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeBlogCard;
