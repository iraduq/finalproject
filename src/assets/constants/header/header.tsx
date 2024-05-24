import "tailwindcss/tailwind.css";

const Header = () => {
  return (
    <div className="header grid-area-header font-oswald mt-2 bg-white p-4 text-center font-medium ">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/src/assets/images/Logo.png"
          draggable="false"
          alt="Logo"
          className="md:h-30 h-24 w-24 sm:h-32 sm:w-32 md:w-36"
        />

        <blockquote className="topquote relative mx-auto max-w-3xl p-2 text-center text-base sm:text-lg md:text-xl">
          <span className="absolute left-0 top-0 text-base text-gray-500 sm:text-lg md:text-xl">
            &ldquo;
          </span>
          Chess is the gymnasium of the mind
          <span className="absolute bottom-0 text-base text-gray-500 sm:text-lg md:text-xl">
            &rdquo;
          </span>
        </blockquote>
        <cite className="text-xs text-gray-500 sm:text-sm md:text-base">
          Blaise Pascal
        </cite>
      </div>
    </div>
  );
};

export default Header;
