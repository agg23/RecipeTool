export interface Item {
    /**
     * @ignore
     */
    id: number;
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

export interface Recipe {
    /**
     * @ignore
     */
    id: number;
    name: string;
    imageUrl?: string;
    description?: string;
    servingSize?: number;
}

export interface RecipeStep {
    /**
     * @ignore
     */
    id: number;
    recipeId: number;
    step: number;
    description?: string;
    foodCategoryId?: number;
    type?: string;
    duration?: number;
}