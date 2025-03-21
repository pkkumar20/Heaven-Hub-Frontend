import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./FilterBar.css";
import { useNavigate } from "react-router-dom";
const FilterBar = () => {
      const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  let scrollTimeout = null;
const categoriesEnum = [
  { name: "Trending", icon: "/Filter bar/ternding.svg" },
  { name: "Dessert", icon: "/Filter bar/desert.svg" },
  { name: "Top Cities", icon: "/Filter bar/Top.svg" },
  { name: "Lake Front", icon: "/Filter bar/Lake front.svg" },
  { name: "Outside City", icon: "/Filter bar/Out side city.svg" },
  { name: "Inside City", icon: "/Filter bar/inside ciyt.svg" },
  { name: "Tiny Homes", icon: "/Filter bar/Tiny homes.svg" },
  { name: "Caves", icon: "/Filter bar/Caves.svg" },
  { name: "Camping", icon: "/Filter bar/Camping.svg" },
  { name: "Hut", icon: "/Filter bar/Hut.svg" },
  { name: "Pool", icon: "/Filter bar/Pool.svg" },
  { name: "Villa", icon: "/Filter bar/Villa.svg" },
  { name: "Arctic", icon: "/Filter bar/Arctic.svg" },
  { name: "Castle", icon: "/Filter bar/Castel.svg" },
  { name: "Island", icon: "/Filter bar/Island.svg" },
  { name: "Farm", icon: "/Filter bar/Farm house.svg" },
  { name: "Mountain", icon: "/Filter bar/Mountain.svg" },
  { name: "Rooms", icon: "/Filter bar/Room.svg" },
  { name: "Luxury", icon: "/Filter bar/Luxary.svg" },
  { name: "Beach", icon: "/Filter bar/Beach.svg" },
  { name: "Others", icon: "/Filter bar/Others.svg" },
];


  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const leftButton = leftButtonRef.current;
    const rightButton = rightButtonRef.current;

    if (!scrollContainer || !leftButton || !rightButton) return;

    const optionWidth = scrollContainer.children[0]?.offsetWidth || 100; // Get the width of one option

    // Toggle button visibility
    const toggleButtons = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const maxScrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;

      leftButton.style.display = scrollLeft > 0 ? "flex" : "none";
      rightButton.style.display =
        scrollLeft >= maxScrollLeft - 1 ? "none" : "flex";
    };

    // Move by one option
    const scrollByOneOption = (direction) => {
      const amount = direction === "left" ? -optionWidth : optionWidth;
      scrollContainer.scrollBy({ left: amount, behavior: "smooth" });
    };

    // Long press to reach start/end
    const scrollToExtreme = (direction) => {
      scrollTimeout = setTimeout(() => {
        if (direction === "start") {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollTo({
            left: scrollContainer.scrollWidth,
            behavior: "smooth",
          });
        }
      }, 50); // Long press delay
    };

    const clearScrollTimeout = () => {
      clearTimeout(scrollTimeout);
    };

    // Click Events
    leftButton.addEventListener("click", () => scrollByOneOption("left"));
    rightButton.addEventListener("click", () => scrollByOneOption("right"));

    // Long Press Events
    leftButton.addEventListener("mousedown", () => scrollToExtreme("start"));
    rightButton.addEventListener("mousedown", () => scrollToExtreme("end"));

    leftButton.addEventListener("mouseup", clearScrollTimeout);
    rightButton.addEventListener("mouseup", clearScrollTimeout);
    leftButton.addEventListener("mouseleave", clearScrollTimeout);
    rightButton.addEventListener("mouseleave", clearScrollTimeout);

    scrollContainer.addEventListener("scroll", toggleButtons);
    toggleButtons();

    return () => {
      leftButton.removeEventListener("click", () => scrollByOneOption("left"));
      rightButton.removeEventListener("click", () =>
        scrollByOneOption("right")
      );

      leftButton.removeEventListener("mousedown", () =>
        scrollToExtreme("start")
      );
      rightButton.removeEventListener("mousedown", () =>
        scrollToExtreme("end")
      );

      leftButton.removeEventListener("mouseup", clearScrollTimeout);
      rightButton.removeEventListener("mouseup", clearScrollTimeout);
      leftButton.removeEventListener("mouseleave", clearScrollTimeout);
      rightButton.removeEventListener("mouseleave", clearScrollTimeout);

      scrollContainer.removeEventListener("scroll", toggleButtons);
    };
  }, []);

  return (
    <div id="filters" className="flex items-center">
      <button ref={leftButtonRef} className="ctrl-btn scroll-btn left">
        <ChevronLeft size={20} />
      </button>

      <div ref={scrollContainerRef} className="scroll-container flex gap-4">
        {categoriesEnum.map((Enum) => {
          return (
            <div
              className="filter flex flex-col items-center justify-center cursor-pointer"
              key={Enum.name}
            >
              <a
                onClick={() => {
                  navigate(`/find?key=${Enum.name}&area=category`);
                }}
                className="flex flex-col items-center"
              >
                <img src={Enum.icon} alt="Image" className="w-8 h-8" />
                <span className="text-center cursor-pointer">{Enum.name}</span>
              </a>
            </div>
          );
        })}
      </div>

      <button ref={rightButtonRef} className="ctrl-btn scroll-btn right">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default FilterBar;
