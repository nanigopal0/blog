import React from "react";

function About() {
  return (
    <div className="h-screen flex justify-center items-center w-full p-6 shadow-lg rounded-lg">
      <div className="w-full lg:w-2/4 md:w-3/4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-4">About us</h1>
          <p className="text-justify mb-4">
            Welcome to our Blog Platform! This application is designed to
            provide a seamless and user-friendly experience for sharing ideas,
            stories, and knowledge. Whether you're a writer, a reader, or
            someone looking for inspiration, this platform is built to
            connect people through the power of words.
          </p>
          <p className="text-justify mb-4">
            Our goal is to create a space where creativity thrives, and
            individuals can express themselves freely. With features like
            customizable profiles, rich text editing, and a vibrant community,
            this platform is your go-to destination for blogging.
          </p>
          <p className="text-justify">
            Thank you for being a part of this journey. We are constantly
            working to improve and add new features to enhance your
            experience. Stay tuned for updates, and feel free to share your
            feedback with us!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;