import { create } from "zustand";

interface AppState {
	isDeleteModalOpen: boolean;
	setIsDeleteModalOpen: (open: boolean) => void;

	isRenameModalOpen: boolean;
	setIsRenameModalOpen: (open: boolean) => void;

	isProcessModalOpen: boolean;
	setIsProcessModalOpen: (open: boolean) => void;

	fileId: string | null;
	setFileId: (fileId: string) => void;

	fileName: string;
	setFilename: (fileName: string) => void;

	totalFiles: number;
	setTotalFiles: (totalFiles: number) => void;
}

export const useAppStore = create<AppState>()((set) => ({
	fileId: null,
	setFileId: (fileId: string) => set((state) => ({ fileId })),

	fileName: "",
	setFilename: (fileName: string) => set((state) => ({ fileName })),

	isDeleteModalOpen: false,
	setIsDeleteModalOpen: (open) => set((state) => ({ isDeleteModalOpen: open })),

	isProcessModalOpen: false,
	setIsProcessModalOpen: (open) =>
		set((state) => ({ isProcessModalOpen: open })),

	isRenameModalOpen: false,
	setIsRenameModalOpen: (open) => set((state) => ({ isRenameModalOpen: open })),

	totalFiles: 0,
	setTotalFiles: (totalFiles: number) => set((state) => ({ totalFiles })),
}));
