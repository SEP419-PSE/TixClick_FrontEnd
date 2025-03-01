import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

// Type definitions
type SeatStatus = "available" | "disabled";
type SeatType = "standard" | "vip" | "premium";
type ToolType = "select" | "add" | "remove" | "edit" | "move";
type ViewMode = "edit" | "preview";

interface ISeat {
  id: string;
  row: number;
  column: number;
  status: SeatStatus;
  price: number;
  seatType: SeatType;
  x?: number;
  y?: number;
}

interface ISection {
  id: string;
  name: string;
  rows: number;
  columns: number;
  seats: ISeat[];
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DraggableSectionProps {
  section: ISection;
  isActive: boolean;
  onSectionClick: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSeatClick: (seat: ISeat) => void;
  getSeatColor: (seat: ISeat) => string;
}

interface SeatMapContainerProps {
  sections: ISection[];
  activeSection: string | null;
  setActiveSection: (id: string) => void;
  updateSection: (id: string, data: Partial<ISection>) => void;
  handleSeatClick: (seat: ISeat) => void;
  getSeatColor: (seat: ISeat) => string;
  containerHeight: number;
  setContainerHeight: (height: number) => void;
  containerWidth: number;
  setContainerWidth: (width: number) => void;
}

// Draggable Section Component using react-draggable
const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  isActive,
  onSectionClick,
  onPositionChange,
  onSeatClick,
  getSeatColor,
}) => {
  // Track dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState<ISeat | null>(null);

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end
  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    setIsDragging(false);
    onPositionChange(data.x, data.y);
  };

  // Calculate seat size based on section dimensions
  const seatSize = Math.min(
    (section.width - 80) / section.columns,
    (section.height - 80) / section.rows
  );

  // Ensure minimum size
  const finalSeatSize = Math.max(seatSize, 18);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Draggable
      position={{ x: section.x, y: section.y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        className={`absolute w-auto h-auto p-4 overflow-visible ${
          isActive ? "border-2 border-pse-green-second" : ""
        }`}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: isActive ? 10 : 1,
        }}
        onClick={() => !isDragging && onSectionClick()}
      >
        <div className="text-center text-black font-semibold mb-2">
          {section.name}
        </div>
        <div className="bg-gray-800 p-2 rounded-md text-black">
          {Array.from({ length: section.rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex text-white gap-1 mb-1">
              <div style={{ width: `${finalSeatSize}px`, textAlign: "center" }}>
                {String.fromCharCode(65 + rowIndex)}
              </div>
              {Array.from({ length: section.columns }).map((_, colIndex) => {
                const seat = section.seats.find(
                  (s) => s.row === rowIndex && s.column === colIndex
                );

                if (!seat)
                  return (
                    <div
                      key={colIndex}
                      style={{
                        width: `${finalSeatSize}px`,
                        height: `${finalSeatSize}px`,
                      }}
                    ></div>
                  );

                return (
                  <div
                    key={colIndex}
                    className={`flex items-center justify-center rounded cursor-pointer ${getSeatColor(
                      seat
                    )} ${
                      seat.status === "disabled" ? "opacity-30" : ""
                    } relative`}
                    style={{
                      width: `${finalSeatSize}px`,
                      height: `${finalSeatSize}px`,
                      fontSize: `${finalSeatSize * 0.6}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDragging) onSeatClick(seat);
                    }}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                  >
                    {colIndex + 1}

                    {/* Seat details tooltip on hover */}
                    {hoveredSeat && hoveredSeat.id === seat.id && (
                      <div
                        className="absolute z-20 bg-black text-white p-2 rounded text-xs whitespace-nowrap"
                        style={{
                          bottom: rowIndex === 0 ? "auto" : "100%",
                          top: rowIndex === 0 ? "100%" : "auto",
                          left: "50%",
                          transform: "translateX(-50%)",
                          marginBottom: rowIndex === 0 ? "0px" : "5px",
                          marginTop: rowIndex === 0 ? "5px" : "0px",
                        }}
                      >
                        <div>Row: {String.fromCharCode(65 + rowIndex)}</div>
                        <div>Seat: {colIndex + 1}</div>
                        <div>Type: {seat.seatType}</div>
                        <div>Price: {formatCurrency(seat.price)}</div>
                        <div>Status: {seat.status}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
};

// Container for draggable sections
const SeatMapContainer: React.FC<SeatMapContainerProps> = ({
  sections,
  activeSection,
  setActiveSection,
  updateSection,
  handleSeatClick,
  getSeatColor,
  containerHeight,
  setContainerHeight,
  containerWidth,
  setContainerWidth,
}) => {
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [isResizingWidth, setIsResizingWidth] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  // Handle height resize start
  //   const handleHeightResizeStart = (e: React.MouseEvent) => {
  //     e.preventDefault();
  //     setIsResizingHeight(true);
  //     setStartY(e.clientY);
  //     setStartHeight(containerHeight);
  //   };

  //   // Handle width resize start
  //   const handleWidthResizeStart = (e: React.MouseEvent) => {
  //     e.preventDefault();
  //     setIsResizingWidth(true);
  //     setStartX(e.clientX);
  //     setStartWidth(containerWidth);
  //   };

  // Handle resize movement
  const handleResizeMove = (e: React.MouseEvent) => {
    if (isResizingHeight) {
      const dy = e.clientY - startY;
      setContainerHeight(Math.max(200, startHeight + dy));
    }

    if (isResizingWidth) {
      const dx = e.clientX - startX;
      setContainerWidth(Math.max(400, startWidth + dx));
    }
  };

  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizingHeight(false);
    setIsResizingWidth(false);
  };

  // Add event listeners for resize
  useEffect(() => {
    if (isResizingHeight || isResizingWidth) {
      window.addEventListener("mousemove", handleResizeMove as any);
      window.addEventListener("mouseup", handleResizeEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleResizeMove as any);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [
    isResizingHeight,
    isResizingWidth,
    startY,
    startHeight,
    startX,
    startWidth,
  ]);

  return (
    <div
      className="relative mx-auto flex justify-center "
      style={{ width: "100%" }}
    >
      <div
        id="mapContainer"
        className="relative w-[1200px] h-[800px] bg-gray-100 border border-gray-300 rounded overflow-hidden"
        // style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
      >
        <div className="absolute top-0 left-0 right-0 p-2 bg-gray-800 text-white text-center">
          STAGE
        </div>

        {sections.map((section) => (
          <DraggableSection
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onSectionClick={() => setActiveSection(section.id)}
            onPositionChange={(x, y) => updateSection(section.id, { x, y })}
            onSeatClick={handleSeatClick}
            getSeatColor={getSeatColor}
          />
        ))}

        {/* Width resize handle */}
        {/* <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize"
          style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          onMouseDown={handleWidthResizeStart}
        ></div> */}
      </div>

      {/* Container height resize handle */}
      {/* <div
        className="w-full h-6 bg-gray-300 border-b border-l border-r border-gray-300 rounded-b cursor-s-resize flex items-center justify-center"
        onMouseDown={handleHeightResizeStart}
      >
        <div className="w-16 h-1 bg-gray-500 rounded"></div>
      </div> */}
    </div>
  );
};

// Main Application Component
const SeatChartDesigner: React.FC = () => {
  const [sections, setSections] = useState<ISection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [currentSeatType, setCurrentSeatType] = useState<SeatType>("standard");
  const [currentPrice, setCurrentPrice] = useState<number>(100);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [containerHeight, setContainerHeight] = useState<number>(400);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [newSectionRows, setNewSectionRows] = useState<number>(6);
  const [newSectionColumns, setNewSectionColumns] = useState<number>(8);

  // Improved calculation of section size based on rows and columns
  const calculateSectionSize = (rows: number, columns: number) => {
    // Base size for each seat plus spacing
    const defaultSeatSize = 25; // Base size for each seat
    const rowLabelWidth = 30; // Width for row labels (A, B, C...)
    const headerHeight = 50; // Height for section title
    const padding = 10; // Padding around the section (8px on each side)

    // Calculate dimensions precisely
    const sectionWidth = columns * defaultSeatSize + rowLabelWidth + padding;
    const sectionHeight = rows * defaultSeatSize + headerHeight + padding;

    return {
      width: Math.max(sectionWidth, 120), // Ensure minimum width
      height: Math.max(sectionHeight, 100), // Ensure minimum height
    };
  };

  // Add a new section with calculated position
  const addSection = () => {
    // Calculate section dimensions based on rows and columns
    const { width: sectionWidth, height: sectionHeight } = calculateSectionSize(
      newSectionRows,
      newSectionColumns
    );

    // Calculate default position - center of the container
    const centerX = (containerWidth - sectionWidth) / 2;
    const centerY = (containerHeight - sectionHeight) / 2;

    const newSection: ISection = {
      id: `section-${sections.length + 1}`,
      name: `Section ${sections.length + 1}`,
      rows: newSectionRows,
      columns: newSectionColumns,
      seats: [],
      x: Math.max(0, centerX),
      y: Math.max(40, centerY), // Avoid overlapping with the stage label
      width: sectionWidth,
      height: sectionHeight,
    };

    // Generate seats for the new section
    newSection.seats = generateSeats(newSection);

    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  // Generate seats for a section
  const generateSeats = (section: ISection): ISeat[] => {
    const seats: ISeat[] = [];
    for (let row = 0; row < section.rows; row++) {
      for (let col = 0; col < section.columns; col++) {
        seats.push({
          id: `${section.id}-r${row}-c${col}`,
          row,
          column: col,
          status: "available",
          price: currentPrice,
          seatType: currentSeatType,
        });
      }
    }
    return seats;
  };

  // Update a section
  const updateSection = (sectionId: string, data: Partial<ISection>) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          const updatedSection = { ...section, ...data };

          // If rows or columns change, automatically adjust section size and regenerate seats
          if (data.rows !== undefined || data.columns !== undefined) {
            // Calculate new dimensions based on rows and columns
            const { width, height } = calculateSectionSize(
              updatedSection.rows,
              updatedSection.columns
            );

            // Update dimensions automatically
            updatedSection.width = width;
            updatedSection.height = height;

            // Regenerate seats
            updatedSection.seats = generateSeats(updatedSection);
          }

          return updatedSection;
        }
        return section;
      })
    );
  };

  // Handle seat click
  const handleSeatClick = (seat: ISeat) => {
    const sectionId = seat.id.split("-r")[0];
    const activeS = sections.find((s) => s.id === sectionId);
    if (!activeS) return;

    if (activeTool === "remove") {
      // Remove seat (mark as disabled)
      updateSection(sectionId, {
        seats: activeS.seats.map((s) =>
          s.id === seat.id ? { ...s, status: "disabled" } : s
        ),
      });
    } else if (activeTool === "add") {
      // Add seat (mark as available)
      updateSection(sectionId, {
        seats: activeS.seats.map((s) =>
          s.id === seat.id
            ? {
                ...s,
                status: "available",
                seatType: currentSeatType,
                price: currentPrice,
              }
            : s
        ),
      });
    } else if (activeTool === "edit") {
      // Edit seat info
      updateSection(sectionId, {
        seats: activeS.seats.map((s) =>
          s.id === seat.id
            ? { ...s, seatType: currentSeatType, price: currentPrice }
            : s
        ),
      });
    }
  };

  // Delete a section
  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
    if (activeSection === sectionId) {
      setActiveSection(sections.length > 1 ? sections[0].id : null);
    }
  };

  // Export JSON data
  const exportData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sections));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "seat_chart.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Get color based on seat type and status
  const getSeatColor = (seat: ISeat): string => {
    if (seat.status === "disabled") return "bg-gray-200";

    switch (seat.seatType) {
      case "standard":
        return "bg-green-500";
      case "vip":
        return "bg-yellow-500";
      case "premium":
        return "bg-purple-500";
      default:
        return "bg-green-500";
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === "edit" ? "preview" : "edit");
  };

  useEffect(() => {
    // Add a default section on startup
    if (sections.length === 0) {
      addSection();
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seat Chart Designer</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={addSection}
        >
          Add Section
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={exportData}
        >
          Export Data
        </button>
        <button
          className={`px-4 py-2 rounded ${
            viewMode === "preview" ? "bg-amber-500 text-white" : "bg-gray-300"
          }`}
          onClick={toggleViewMode}
        >
          {viewMode === "edit" ? "Preview" : "Back to Edit"}
        </button>
      </div>

      {/* New Section Size Controls */}
      {viewMode === "edit" && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">New Section Rows:</label>
            <input
              type="number"
              className="px-2 py-1 border rounded w-full text-black"
              value={newSectionRows}
              onChange={(e) => setNewSectionRows(parseInt(e.target.value) || 6)}
              min="1"
              max="20"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              New Section Columns:
            </label>
            <input
              type="number"
              className="px-2 py-1 border rounded w-full text-black"
              value={newSectionColumns}
              onChange={(e) =>
                setNewSectionColumns(parseInt(e.target.value) || 8)
              }
              min="1"
              max="20"
            />
          </div>
        </div>
      )}

      {/* Section selector */}
      {sections.length > 0 && viewMode === "edit" && (
        <div className="flex flex-wrap gap-2 mb-4">
          {sections.map((section) => (
            <div key={section.id} className="flex items-center">
              <button
                className={`px-4 py-2 rounded ${
                  activeSection === section.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.name}
              </button>
              <button
                className="ml-1 px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => deleteSection(section.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Section settings if selected */}
      {activeSection && viewMode === "edit" && (
        <div className="bg-gray-800 text-white p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Section Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Section Name</label>
              <input
                type="text"
                className="w-full px-2 py-1 border rounded text-black"
                value={sections.find((s) => s.id === activeSection)?.name || ""}
                onChange={(e) =>
                  updateSection(activeSection, { name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1">Rows</label>
              <input
                type="number"
                className="w-full px-2 py-1 border rounded text-black"
                value={sections.find((s) => s.id === activeSection)?.rows || 0}
                onChange={(e) =>
                  updateSection(activeSection, {
                    rows: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="block mb-1">Columns</label>
              <input
                type="number"
                className="w-full px-2 py-1 border rounded text-black"
                value={
                  sections.find((s) => s.id === activeSection)?.columns || 0
                }
                onChange={(e) =>
                  updateSection(activeSection, {
                    columns: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Tools:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded ${
                  activeTool === "add"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveTool("add")}
              >
                Add Seat
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  activeTool === "remove"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveTool("remove")}
              >
                Remove Seat
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  activeTool === "edit"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveTool("edit")}
              >
                Edit Seat
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  activeTool === "move"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveTool("move")}
              >
                Move
              </button>
            </div>
          </div>

          {(activeTool === "add" || activeTool === "edit") && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Seat Type</label>
                <select
                  className="w-full px-2 py-1 border rounded text-black"
                  value={currentSeatType}
                  onChange={(e) =>
                    setCurrentSeatType(e.target.value as SeatType)
                  }
                >
                  <option value="standard">Standard</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border rounded text-black"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seat Map */}
      <div className="mb-4 overflow-x-auto">
        <SeatMapContainer
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          updateSection={updateSection}
          handleSeatClick={handleSeatClick}
          getSeatColor={getSeatColor}
          containerHeight={containerHeight}
          setContainerHeight={setContainerHeight}
          containerWidth={containerWidth}
          setContainerWidth={setContainerWidth}
        />
      </div>

      {/* Resize instructions */}
      <div className="text-center text-gray-600 mb-4">
        <p>Drag the handle below the container to resize its height</p>
        <p>
          Drag the handle on the right side of the container to resize its width
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Standard</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>VIP</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
          <span>Premium</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 opacity-30 rounded mr-2"></div>
          <span>Disabled</span>
        </div>
      </div>
    </div>
  );
};

export default SeatChartDesigner;
