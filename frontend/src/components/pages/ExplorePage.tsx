import { useEffect } from "react";
import ReportsSection from "../sections/ReportsSection";


export default function ExplorePage() {

      useEffect(() => {
        // Default: system theme
        const storedTheme = localStorage.getItem("theme") as
          | "light"
          | "dark"
          | "system"
          | null;
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        const activeTheme = storedTheme || "system";
    
        const applyTheme = (theme: string) => {
          if (theme === "system") {
            document.documentElement.classList.toggle("dark", prefersDark);
          } else {
            document.documentElement.classList.toggle("dark", theme === "dark");
          }
        };
        applyTheme(activeTheme);
      }, []);

    return (
        <div className="container">
            <ReportsSection />
        </div>
    )
}