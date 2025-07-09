"use client";
import ThemeToggle from "./ThemeToggle";
import NotificationSystem from "./NotificationSystem";

export default function TopRightActions() {
  return (
    <div className="fixed top-4 right-6 z-50 flex items-center gap-4">
      <ThemeToggle />
      <NotificationSystem />
    </div>
  );
} 