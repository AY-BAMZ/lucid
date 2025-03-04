import { create } from "zustand";

const useStore = create((set) => ({
  blocks: [],
  inputValue: "",
  showDropdown: false,
  filteredTags: [],
  activeBlockIndex: null,
  variables: [],

  setBlocks: (blocks: any) => set({ blocks }),
  setInputValue: (inputValue: any) => set({ inputValue }),
  setShowDropdown: (showDropdown: any) => set({ showDropdown }),
  setFilteredTags: (filteredTags: any) => set({ filteredTags }),
  setActiveBlockIndex: (activeBlockIndex: any) => set({ activeBlockIndex }),
  setVariable: (variables: any) => set({ variables }),

  addBlock: (block: any) =>
    set((state: any) => {
      let newBlocks = [...state.blocks];
      if (state.activeBlockIndex !== null) {
        newBlocks.splice(state.activeBlockIndex + 1, 0, block);
      } else {
        newBlocks.push(block);
      }
      return {
        blocks: newBlocks,
        inputValue: "",
        showDropdown: false,
        activeBlockIndex: null,
      };
    }),
}));

export default useStore;
