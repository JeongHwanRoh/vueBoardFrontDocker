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