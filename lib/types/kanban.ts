export interface Card{
    id: number;
    title: string;

}

export interface Column{
    id: string;
    title: string;
    cards: Card[];
}