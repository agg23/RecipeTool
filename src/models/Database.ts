export interface Item {
    /**
     * @ignore
     */
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