import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SOUND_OFF } from "../constants/localStorage";

const OPTIONS = [
  {
    label: "Play demo",
    href: "/login",
  },
  {
    label: "sound",
  },
  {
    label: "about us",
  },
];

interface MenuProps {
  onClose: () => void;
}

export const Menu = ({ onClose }: MenuProps) => {
  const [activeOption, setActiveOption] = useState(0);
  const navigate = useNavigate();
  const [soundActive, setSoundActive] = useState(
    !localStorage.getItem(SOUND_OFF)
  );
  const [showAbout, setShowAbout] = useState(false);

  const onKeyDown = (event: { key: string }) => {
    console.log(event.key);
    if (event.key === "ArrowDown") {
      setActiveOption((prev) => {
        return prev < 3 ? prev + 1 : prev;
      });
    } else if (event.key === "ArrowUp") {
      setActiveOption((prev) => {
        return prev > 0 ? prev - 1 : prev;
      });
    } else if (event.key === "Enter" || event.key === " ") {
      if (activeOption === 0) {
        const href = OPTIONS.at(activeOption)?.href;
        href && navigate(href);
      } else if (activeOption === 1) {
        setSoundActive((prev) => {
          if (prev) {
            localStorage.setItem(SOUND_OFF, "true");
          } else {
            localStorage.removeItem(SOUND_OFF);
          }
          return !prev;
        });
      } else {
        setShowAbout((prev) => !prev);
      }
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);

    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [onKeyDown]);

  return (
    <>
      <div className="menu">
        <header>Jokers of Neon</header>
        {showAbout ? (
          <Box sx={{ px: 10 }}>
            About us:
            <br />
            <Box sx={{ my: 4 }}>
              <a href="https://x.com/dpinoness" target="_blank">
                @dpinoness
              </a>
              {" - "} Cairo dev
              <br />
              <a href="https://x.com/nico_n44" target="_blank">
                @nico_n44
              </a>
              {" - "} Frontend dev
            </Box>
            DM us on X
          </Box>
        ) : (
          <ul>
            {OPTIONS.map((option, index) => (
              <li
                key={option.label}
                className={index === activeOption ? "active" : ""}
              >
                <a href={option.href} title="">
                  {option.label}{" "}
                  {option.label === "sound" && (soundActive ? "on" : "off")}
                </a>
              </li>
            ))}
          </ul>
        )}
        <footer>
          <div className="key">
            Exit: <span>ESC</span>
          </div>
          <div className="key">
            Select: <span>ENTER</span>
          </div>
        </footer>
      </div>
    </>
  );
};
