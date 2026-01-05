export interface BoardResponse{

    boardId: number;
    title: string;
    content: string;
    pn: number;
    writer: string;
    regdate: string | number | null;
    viewcnt: number;
    category: string;
}

export interface BoardCreateRequest{
    title: string;
    content: string;
    writer: string;
    pn: number;
    regdate: Date;
}