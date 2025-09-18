export interface Role1 {
    do1?: boolean;
    do2?: boolean;
    do3?: boolean;
    do4?: boolean;
    do5?: boolean;
    do6?: boolean;
    do7?: boolean;
    do8?: boolean;
    do9?: boolean;
    do10?: boolean;
    do11?: boolean;
    do12?: boolean;
    do13?: boolean;
    do14?: boolean;
    do15?: boolean;
    do16?: boolean;
    do17?: boolean;
    do18?: boolean;
    do19?: boolean;
    do20?: boolean;
}

export type User = {
    role1?: Role1;
    id?: number;
    name?: string;
    username?: string;
    statusWork?: string;
    email?: string;
    phone?: string;
    image?: string;
    note?: string;
    role?: string;
    gender?: string;
    ipUser?: string;
    userAcceptName?: string;
    ipAccept?: string;
    rfid?: string;
    barcode?: string;
    qrCode?: string;
    updatedAt?: string;
    createdAt?: string;
    unitIds?: number[];
};


export type Unit = {
    id: number;
    name: string;
    serverUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    users: {
        id: number;
        name: string | null;
        username: string | null;
        email: string | null;
    }[];
    createdBy?: {
        id: number;
        name: string | null;
        email: string | null;
    } | null;
};
