import React from "react";

function About() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Blogify
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Connecting writers and readers worldwide
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Welcome to our Blog Platform! This application is designed to
              provide a seamless and user-friendly experience for sharing ideas,
              stories, and knowledge. Whether you're a writer, a reader, or
              someone looking for inspiration, this platform is built to
              connect people through the power of words.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our goal is to create a space where creativity thrives, and
              individuals can express themselves freely. With features like
              customizable profiles, rich text editing, and a vibrant community,
              this platform is your go-to destination for blogging.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Join Us</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Thank you for being a part of this journey. We are constantly
              working to improve and add new features to enhance your
              experience. Stay tuned for updates, and feel free to share your
              feedback with us!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;