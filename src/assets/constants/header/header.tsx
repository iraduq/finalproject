import "tailwindcss/tailwind.css";

const Header = () => {
  return (
    <div className="header grid-area-header font-oswald mt-2 bg-white p-4 text-center font-medium">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/src/assets/images/loggo.png"
          draggable="false"
          alt="Logo"
          className="md:h-20 h-16 w-16 sm:h-20 sm:w-30 md:w-50"
        />

        <blockquote className="topquote relative mx-auto max-w-3xl p-2 text-center text-base sm:text-lg md:text-xl">
          <span className="absolute left-0 top-0 text-base text-gray-500 sm:text-lg md:text-xl"></span>
          CHESS
          <span className="absolute bottom-0 text-base text-gray-500 sm:text-lg md:text-xl"></span>
        </blockquote>
        <cite className="text-xs text-gray-500 sm:text-sm md:text-base">
          Techy Pythons
        </cite>
      </div>
    </div>
  );
};

export default Header;
