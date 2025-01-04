import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditState {
  petals: number;
  flowers: number;
  transactions: Array<{
    type: 'earn' | 'spend' | 'convert';
    amount: number;
    date: string;
    description: string;
  }>;
}

const initialState: CreditState = {
  petals: 0,
  flowers: 0,
  transactions: [],
};

const creditSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    addPetals: (state, action: PayloadAction<number>) => {
      state.petals += action.payload;
      state.transactions.push({
        type: 'earn',
        amount: action.payload,
        date: new Date().toISOString(),
        description: 'Pétales ajoutés',
      });
    },
    spendPetals: (state, action: PayloadAction<number>) => {
      state.petals -= action.payload;
      state.transactions.push({
        type: 'spend',
        amount: action.payload,
        date: new Date().toISOString(),
        description: 'Pétales dépensés',
      });
    },
    convertPetalsToFlowers: (state, action: PayloadAction<number>) => {
      const conversionRate = 10; // 10 pétales = 1 fleur
      const flowersEarned = action.payload / conversionRate;
      
      state.petals -= action.payload;
      state.flowers += flowersEarned;
      state.transactions.push({
        type: 'convert',
        amount: action.payload,
        date: new Date().toISOString(),
        description: `Conversion de ${action.payload} pétales en ${flowersEarned} fleurs`,
      });
    },
    resetCredits: () => initialState,
  },
});

export const { addPetals, spendPetals, convertPetalsToFlowers, resetCredits } = creditSlice.actions;
export default creditSlice.reducer;
