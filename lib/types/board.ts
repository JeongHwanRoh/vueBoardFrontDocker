export interface BoardResponse{

    boardId: number;
    title: string;
    content: string;
    pn: number;
    writer: string | null;
    regdate: string | number | null;
}

export interface BoardCreateRequest{
    title: string;
    content: string;
    writer: string | null;
    pn: number | null;
    regdate: Date;
}