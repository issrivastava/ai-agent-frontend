import { create } from 'zustand';

type UiState = {
  commandOpen: boolean;
  helpOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  setHelpOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandOpen: false,
  helpOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  setHelpOpen: (open) => set({ helpOpen: open }),
}));
