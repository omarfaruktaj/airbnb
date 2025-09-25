"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TabItemType = {
  id: string;
  label: string;
  description: string;
};

type FilterTabsProps = {
  tabs?: TabItemType[];
  defaultActiveId?: string | null;
  onTabChange?: (id: string) => void;
  className?: string;
};

const MOCK_TABS: TabItemType[] = [
  { id: "Where", label: "Where", description: "Search destinations" },
  { id: "check-in", label: "Check in", description: "Add dates" },
  { id: "check-out", label: "Check out", description: "Add dates" },
  { id: "who", label: "Who", description: "Add guests" },
];

const FilterTabs = React.forwardRef<HTMLDivElement, FilterTabsProps>(
  (props, ref) => {
    const {
      tabs = MOCK_TABS,
      defaultActiveId = null,
      onTabChange,
      className,
    } = props;
    const [activeTab, setActiveTab] = React.useState(defaultActiveId);
    const [hoveredTab, setHoveredTab] = React.useState<string | null>(null);
    const [isInitialAnimation, setIsInitialAnimation] = React.useState(true);

    const handleClick = React.useCallback(
      (id: string) => {
        if (isInitialAnimation) {
          setIsInitialAnimation(false);
        }
        setActiveTab(id);
        onTabChange?.(id);
      },
      [onTabChange, isInitialAnimation]
    );

    const activeIndex = React.useMemo(
      () => tabs.findIndex((tab) => tab.id === activeTab),
      [tabs, activeTab]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center bg-background rounded-full border h-[66px] w-[850px]",
          className
        )}
        onMouseLeave={() => setHoveredTab(null)}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;

          const isAdjacentLeft = index === activeIndex - 1;
          const isAdjacentRight = index === activeIndex + 1;

          const isHoveredAdjacent =
            (hoveredTab === tabs[activeIndex - 1]?.id && isActive) ||
            (hoveredTab === tabs[activeIndex + 1]?.id && isActive);

          const isLeftAdjacentHovered = isHovered && isAdjacentLeft;
          const isRightAdjacentHovered = isHovered && isAdjacentRight;

          const prevTabId = tabs[index - 1]?.id;
          const shouldHideSeparator =
            isActive ||
            isHovered ||
            activeTab === prevTabId ||
            hoveredTab === prevTabId;

          return (
            <React.Fragment key={tab.id}>
              {index > 0 && (
                <div
                  className={cn(
                    "h-8 w-px bg-border transition-opacity duration-300",
                    shouldHideSeparator && "opacity-0"
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => handleClick(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                className={cn(
                  "relative px-4 py-2 w-full h-full rounded-full transition-colors duration-300 ease-in-out",
                  "text-sm font-medium ",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && isHoveredAdjacent && activeTab && (
                  <motion.div
                    layoutId="active-tab-hover-underlay"
                    className={cn(
                      "absolute inset-0 bg-muted z-[5]",
                      hoveredTab === tabs[activeIndex - 1]?.id
                        ? "top-0 bottom-0 right-0 -left-1 rounded-r-full"
                        : hoveredTab === tabs[activeIndex + 1]?.id
                        ? "top-0 bottom-0 left-0 -right-1 rounded-l-full"
                        : "inset-0"
                    )}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                  />
                )}
                {isHovered && !isActive && (
                  <motion.div
                    className={cn(
                      "absolute bg-muted z-0 overflow-hidden",
                      activeTab && isLeftAdjacentHovered
                        ? "top-0 bottom-0 left-0 -right-1 rounded-l-full"
                        : activeTab && isRightAdjacentHovered
                        ? "top-0 bottom-0 right-0 -left-1 rounded-r-full"
                        : "inset-0 rounded-full"
                    )}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="pill-tabs-active-pill"
                    initial={
                      isInitialAnimation ? { scale: 0.8, opacity: 0 } : false
                    }
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    className="absolute inset-0 bg-primary rounded-full z-10"
                  ></motion.div>
                )}
                <div className="flex flex-col justify-center items-start overflow-hidden text-muted-foreground hover:text-foreground">
                  <span className="relative z-20">{tab.label}</span>
                  <span
                    className={cn(
                      "relative z-20 text-left",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {tab.description}
                  </span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

FilterTabs.displayName = "FilterTabs";
export { FilterTabs };
