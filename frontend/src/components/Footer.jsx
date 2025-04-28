const Footer = () => {
  return (
    <footer className="mt-20 border-t py-10 border-neutral-800 relative font-medium text-white ">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-purple-950/5 rounded-full filter blur-[80px]"></div>
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-orange-950/20 rounded-full filter blur-[80px]"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container my-1 mx-auto relative z-10 flex-col items-center text-center">
        <div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-red-300">
            CUEngage © 2025
          </h3>
          <p className="text-sm text-zinc-500">All Rights Reserved</p>
          <p className="text-sm text-zinc-200 mt-2">
            Made with <span className="text-red-500">❤</span> by{" "}
            <a
              className="text-blue-400"
              href="https://instagram.com/chitkarau"
              target="_blank"
              rel="noopener noreferrer"
            >
              NewEraWeb (NEW)
            </a>
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold  mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-purple-300">
            Connect with Us
          </h4>
          <div className="flex justify-center space-x-4">
            <a
              href="https://instagram.com/chitkarau"
              className="text-pink-400 hover:text-pink-800 transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            {/* <a
              href=""
              className="text-blue-300 hover:text-blue-600 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-linkedin"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a> */}
            <a
              href="https://www.facebook.com/ChitkaraU"
              className="text-blue-500 hover:text-blue-200 transition-colors duration-300"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold  mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300">
            About CUEngage
          </h4>
          <p className="text-sm text-zinc-200 mb-2">
            CUEngage is dedicated to creating unforgettable experiences for
            students through engaging events and activities.
          </p>
          <p className="text-sm text-zinc-200 mb-2">
            Join us as we celebrate creativity, talent, and collaboration within
            our community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
