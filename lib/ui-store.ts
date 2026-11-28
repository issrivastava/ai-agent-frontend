import { create } from 'zustand';

type UiState = {
  commandOpen: boolean;
  helpOpen: boolean;
  tourOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  setHelpOpen: (open: boolean) => void;
  setTourOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandOpen: false,
  helpOpen: false,
  tourOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  setHelpOpen: (open) => set({ helpOpen: open }),
  setTourOpen: (open) => set({ tourOpen: open }),
}));
