export interface Item {
    id: string;
    name: string;
    brandName: string;
    upc: number;
    imageUrl?: string;
    lastSeenPrice?: number;
    detailImageUrl?: string;

    itemSize?: number;
    itemSizeType?: string;

    foodCategoryId?: number;
}