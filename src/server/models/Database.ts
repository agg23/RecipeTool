export interface Item {
    /**
     * @ignore
     */
    id: number;
    name: string;
    brandName: string;
    upc: number;
    /** @nullable */
    imageUrl?: string;
    /** @nullable */
    lastSeenPrice?: number;
    /** @nullable */
    detailImageUrl?: string;

    /** @nullable */
    itemSize?: number;
    /** @nullable */
    itemSizeType?: string;

    /** @nullable */
    foodCategoryId?: number;
}

export interface Recipe {
    /**
     * @ignore
     */
    id: number;
    name: string;
    /** @nullable */
    imageUrl?: string;
    /** @nullable */
    description?: string;
    /** @nullable */
    servingSize?: number;
}

export interface RecipeStep {
    /**
     * @ignore
     */
    id: number;
    recipeId: number;
    step: number;
    /** @nullable */
    description?: string;
    /** @nullable */
    foodCategoryId?: number;
    /** @nullable */
    type?: string;
    /** @nullable */
    duration?: number;
}