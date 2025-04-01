

// const TicketBooking = () => {
//   return (
//     <div>TicketBooking</div>
//   )
// }

// export default TicketBooking

// import React from "react";

// // Type definitions
// type SeatStatus = "available" | "disabled";
// type ToolType = "select" | "add" | "remove" | "edit" | "move" | "addSeatType";
// type ViewMode = "edit" | "preview";
// export type SectionType = "SEATED" | "STANDING";

// // Utility functions
// const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//   }).format(amount);
// };

// export type SeatTypeEdit = {
//   id: string;
//   name: string;
//   color: string;
//   textColor: string;
//   price: number;
//   minQuantity?: number;
//   maxQuantity?: number;
//   eventId?: number;
// };

// export interface ISeat {
//   id: string;
//   row: number;
//   column: number;
//   // status: SeatStatus;
//   price: number;
//   seatTypeId: string;
//   x?: number;
//   y?: number;
// }

// export interface ISection {
//   id: string;
//   name: string;
//   rows: number;
//   columns: number;
//   seats: ISeat[];
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   type: SectionType;
//   priceId?: string;
//   price?: number; // Price for standing sections
//   capacity?: number; // Capacity for standing sections
//   isSave: boolean;
// }

// interface DraggableSectionProps {
//   section: ISection;
//   isActive: boolean;
//   onSectionClick: () => void;
//   onPositionChange: (x: number, y: number) => void;
//   onSeatClick: (seat: ISeat) => void;
//   getSeatColor: (seat: ISeat) => string;
//   seatTypes: SeatTypeEdit[];
// }

// interface SeatMapContainerProps {
//   sections: ISection[];
//   activeSection: string | null;
//   setActiveSection: (id: string) => void;
//   updateSection: (id: string, data: Partial<ISection>) => void;
//   handleSeatClick: (seat: ISeat) => void;
//   getSeatColor: (seat: ISeat) => string;
//   seatTypes: SeatTypeEdit[];
// }

// const DraggableSection: React.FC<DraggableSectionProps> = ({
//   section,
//   isActive,
//   onSectionClick,
//   onPositionChange,
//   onSeatClick,
//   getSeatColor,
//   seatTypes,
// }) => {
//   // Track dragging state
//   const [isDragging, setIsDragging] = useState(false);
//   const [hoveredSeat, setHoveredSeat] = useState<ISeat | null>(null);

//   // Handle drag start
//   const handleDragStart = () => {
//     setIsDragging(true);
//   };

//   // Handle drag end
//   const handleDragStop = (_e: any, data: { x: number; y: number }) => {
//     setIsDragging(false);
//     onPositionChange(data.x, data.y);
//   };

//   // Calculate seat size based on section dimensions
//   const seatSize = Math.min(
//     (section.width - 80) / section.columns,
//     (section.height - 80) / section.rows
//   );

//   return (
//     <Draggable
//       position={{ x: section.x, y: section.y }}
//       onStart={handleDragStart}
//       onStop={handleDragStop}
//       bounds="parent"
//     >
//       <div
//         className={`absolute w-auto h-auto p-4 overflow-visible ${
//           isActive ? "border-2 border-blue-500" : ""
//         }`}
//         style={{
//           opacity: isDragging ? 0.5 : 1,
//           cursor: "move",
//           backgroundColor: "white",
//           borderRadius: "8px",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//           zIndex: isActive ? 10 : 1,
//         }}
//         onClick={() => !isDragging && onSectionClick()}
//       >
//         <div className="text-center text-gray-800 font-semibold mb-3">
//           {section.name}
//           {section.type == "STANDING" && (
//             <div className="text-sm text-gray-600 mt-1">
//               Khu vực đứng - {formatCurrency(section.price || 0)}
//             </div>
//           )}
//         </div>
//         {section.type == "STANDING" ? (
//           <div
//             className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg flex flex-col items-center justify-center text-gray-700 font-medium relative overflow-hidden"
//             style={{
//               width: section.width - 32,
//               height: section.height - 32,
//               minWidth: "180px",
//               minHeight: "80px",
//             }}
//           >
//             <div className="absolute inset-0 opacity-10">
//               <div
//                 className="absolute inset-0"
//                 style={{
//                   backgroundImage: `repeating-linear-gradient(45deg, #6b7280 0, #6b7280 1px, transparent 0, transparent 50%)`,
//                   backgroundSize: "10px 10px",
//                 }}
//               />
//             </div>
//             <div className="flex flex-col items-center relative z-10">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 mb-3 text-gray-500"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="text-sm text-gray-500">
//                 Số lượng: {section.capacity || 0} vé
//               </span>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-gray-100 p-3 rounded-lg">
//             {Array.from({ length: section.rows }).map((_, rowIndex) => (
//               <div key={rowIndex} className="flex text-gray-700 gap-2.5 mb-2.5">
//                 <div
//                   style={{
//                     width: `30px`,
//                     textAlign: "center",
//                     height: "30px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: "600",
//                   }}
//                   className="bg-gray-700 bg-opacity-20 rounded-md"
//                 >
//                   {String.fromCharCode(65 + rowIndex)}
//                 </div>
//                 {Array.from({ length: section.columns }).map((_, colIndex) => {
//                   const seat = section.seats.find(
//                     (s) => s.row == rowIndex && s.column == colIndex
//                   );

//                   if (!seat)
//                     return (
//                       <div
//                         key={colIndex}
//                         style={{
//                           width: `30px`,
//                           height: `30px`,
//                           marginRight: "5px",
//                         }}
//                       ></div>
//                     );

//                   const seatColor = getSeatColor(seat);

//                   return (
//                     <div
//                       key={colIndex}
//                       className="flex items-center justify-center rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
//                       style={{
//                         width: `30px`,
//                         height: `30px`,
//                         fontSize: `14px`,
//                         backgroundColor:
//                           // seat.status == "disabled" ? "#f3f4f6" : seatColor,
//                           seatColor,
//                         color:
//                           // seat.status == "disabled"
//                           //   ? "#9ca3af"
//                           //   : seatTypes.find(
//                           //       (type) => type.id == seat.seatTypeId
//                           //     )?.textColor || "#000000",
//                           seatTypes.find((type) => type.id == seat.seatTypeId)
//                             ?.textColor || "#000000",
//                         // opacity: seat.status == "disabled" ? 0.3 : 1,
//                         marginRight: "5px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         cursor: "pointer",
//                         fontWeight: "500",
//                       }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (!isDragging) onSeatClick(seat);
//                       }}
//                       onMouseEnter={() => setHoveredSeat(seat)}
//                       onMouseLeave={() => setHoveredSeat(null)}
//                     >
//                       {String.fromCharCode(65 + rowIndex)}
//                       {colIndex + 1}

//                       {hoveredSeat && hoveredSeat.id == seat.id && (
//                         <div
//                           className="absolute z-20 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap shadow-lg"
//                           style={{
//                             bottom: rowIndex == 0 ? "auto" : "100%",
//                             top: rowIndex == 0 ? "100%" : "auto",
//                             left: "50%",
//                             transform: "translateX(-50%)",
//                             marginBottom: rowIndex == 0 ? "0" : "2px",
//                             marginTop: rowIndex == 0 ? "2px" : "0",
//                           }}
//                         >
//                           <div className="mb-1">
//                             Hàng: {String.fromCharCode(65 + rowIndex)}
//                           </div>
//                           <div className="mb-1">Ghế: {colIndex + 1}</div>
//                           <div className="mb-1">
//                             Loại ghế:{" "}
//                             {seatTypes.find(
//                               (type) => type.id == seat.seatTypeId
//                             )?.name || "Chưa xác định"}
//                           </div>
//                           <div className="mb-1">
//                             Giá: {formatCurrency(seat.price)}
//                           </div>
//                           {/* <div>
//                             Trạng thái:{" "}
//                             {seat.status == "available"
//                               ? "Có sẵn"
//                               : "Đã vô hiệu"}
//                           </div> */}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </Draggable>
//   );
// };

// const TicketBooking = (props: Props) => {
//   return (
//     <div
//       className="relative mx-auto flex justify-center"
//       style={{ width: "100%" }}
//     >
//       <div
//         id="mapContainer"
//         className="relative w-[1200px] h-[800px] bg-gray-100 border border-gray-300 rounded overflow-hidden"
//       >
//         <div className="absolute top-0 left-0 right-0 p-5 bg-gray-800 text-white text-center">
//           STAGE
//         </div>

//         {sections.map((section) => (
//           <DraggableSection
//             key={section.id}
//             section={section}
//             isActive={activeSection == section.id}
//             onSectionClick={() => setActiveSection(section.id)}
//             onPositionChange={(x, y) => updateSection(section.id, { x, y })}
//             onSeatClick={handleSeatClick}
//             getSeatColor={getSeatColor}
//             seatTypes={seatTypes}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TicketBooking;
