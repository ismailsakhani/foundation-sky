import { Plane, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Search", path: "/" },
  { label: "Notifications", path: "/notifications" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 glow-primary">
            <Plane className="h-4 w-4 text-primary" />
          </div>
          <span className="text-data text-sm font-semibold tracking-wider text-foreground">
            FLIGHT<span className="text-primary">OPS</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label === "Notifications" ? (
                <Bell className="h-4 w-4" />
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
