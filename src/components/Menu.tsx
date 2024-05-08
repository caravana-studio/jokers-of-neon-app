import { useCallback, useEffect, useState } from "react";

const OPTIONS = [
  {
    label: "Play demo",
    href: "/demo",
  },
  {
    label: "picture",
    href: "/",
  },
  {
    label: "sound",
    href: "/",
  },
  {
    label: "contact",
    href: "/",
  },
];

export const Menu = () => {
  const [activeOption, setActiveOption] = useState(0);
  const onKeyDown = useCallback((event: { key: string }) => {
    console.log("event.key", event.key);
    if (event.key === "ArrowDown" && activeOption < 3) {
      setActiveOption((prev) => prev + 1);
    } else if (event.key === "ArrowUp" && activeOption > 0) {
      setActiveOption((prev) => prev - 1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);

    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [onKeyDown]);

  return (
    <div className="menu">
      <header>Main Menu</header>
      <ul>
        {OPTIONS.map((option, index) => (
          <li className={index === activeOption ? "active" : ""}>
            <a href={option.href} title="">
              {option.label}
            </a>
          </li>
        ))}
      </ul>
      <footer>
        <div className="key">
          Exit: <span>ESC</span>
        </div>
        <div className="key">
          Select: <span>ENTER</span>
        </div>
      </footer>
    </div>
  );
};
