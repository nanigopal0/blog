export function handleResponseFromFetchBlog(response,{onLogin}) {
    if (response.status == 401) {  //Unauthorised as token invalid go the login page
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
        onLogin();
        throw new Error("Unauthorised user as token invalid")
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the text from the response
}