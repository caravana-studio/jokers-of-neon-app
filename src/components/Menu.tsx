import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const onKeyDown = (event: { key: string }) => {
    if (event.key === "ArrowDown") {
      setActiveOption((prev) => {
        return prev < 3 ? prev + 1 : prev;
      });
    } else if (event.key === "ArrowUp") {
      setActiveOption((prev) => {
        return prev > 0 ? prev - 1 : prev;
      });
    } else if (event.key === "Enter") {
      const href = OPTIONS.at(activeOption)?.href;
      href && navigate(href);
    }
  };

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
          <li
            key={option.label}
            className={index === activeOption ? "active" : ""}
          >
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
