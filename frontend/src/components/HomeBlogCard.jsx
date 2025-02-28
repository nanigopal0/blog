import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import htmlTruncate from 'html-truncate';

function HomeBlogCard(props) {
  const navigate = useNavigate();
  
  const navigateReader = (id) => {
    const data = { isBlogOfCurrentUser: (props.username ? false : true)};
    navigate(`/blog/${id}`,{state:data});
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
      onClick={() => navigateReader(props.id)}
    >
      <div title="cover image">
        <img
          className="h-48 w-full object-cover"
          src={props.coverImage}
          alt=""
        />
      </div>
      <div className=" bg-white  p-4 flex flex-col justify-between leading-normal">
        <div className="mb-4">
          <div className="text-gray-900 font-bold text-xl mb-2">
            {props.title}
          </div>
          <div
            className="text-gray-700 text-base"
            dangerouslySetInnerHTML={{ __html: truncateHtmlContent(props.content) }}
          ></div>
        </div>
        <div className="flex items-center">
          {props.userImage !== "null" ? (
            <img
              className="w-10 h-10 rounded-full mr-4"
              src={`${props.userImage ? props.userImage : "/src/assets/person.svg"}`}
              alt="avatar"
            />
          ) : (
            <> </>
          )}
          <div className="text-sm">
            {props.username ? (
              <p className="text-gray-900 font-semibold leading-none">
                {props.username}
              </p>
            ) : (
              <></>
            )}
            <p className="text-gray-600">{props.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

HomeBlogCard.propTypes = {
  id: PropTypes.string,
  coverImage: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.string,
  userImage: PropTypes.string,
  username: PropTypes.string,
};

HomeBlogCard.defaultProps = {
  id: "0",
  coverImage: null,
  title: null,
  content: null,
  date: null,
  userImage: null,
  username: null,
};
export default HomeBlogCard;
