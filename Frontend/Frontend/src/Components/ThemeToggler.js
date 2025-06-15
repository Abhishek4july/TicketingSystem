import React, { useEffect, useState } from "react";

const ThemeToggler = () => {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" || false
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700"
    >
      {dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggler;
