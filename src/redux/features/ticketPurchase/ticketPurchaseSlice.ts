import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OldTicketPurchase {
  ticketPurchaseId: number;
  quantity: number;
  caseTicket: CaseTicketType;
}

export type CaseTicketType = "noSeatMap" | "changeSeat" | "changeZone" | null;

const initialState: OldTicketPurchase = {
  ticketPurchaseId: 0,
  quantity: 0,
  caseTicket: null,
};

const ticketPurchase = createSlice({
  name: "ticketPurchase",
  initialState,
  reducers: {
    setTicketPurchase(state, action: PayloadAction<OldTicketPurchase>) {
      return { ...action.payload };
    },
    clearTicketPurchase() {
      return initialState;
    },
  },
});

export const { setTicketPurchase, clearTicketPurchase } =
  ticketPurchase.actions;
export default ticketPurchase.reducer;
