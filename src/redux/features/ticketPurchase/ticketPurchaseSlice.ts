import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number = 0;

const ticketPurchase = createSlice({
  name: "ticketPurchase",
  initialState,
  reducers: {
    setTicketPurchase(state, action: PayloadAction<number>) {
      return action.payload;
    },
    clearTicketPurchase() {
      return initialState;
    },
  },
});

export const { setTicketPurchase, clearTicketPurchase } =
  ticketPurchase.actions;
export default ticketPurchase.reducer;
