export interface Slot {
    id: number;
    label: string;
    width: number;
    height: number;
    medName?: string | null;
    quantity?: number | null;
    isCabinetOpen: boolean;
    isLightOn: boolean;
    isOnline: boolean;
    typyCabinet?: string | null;
}

export interface Shelf {
    id: number;
    slots: Slot[];
}
