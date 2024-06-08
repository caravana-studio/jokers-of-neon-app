export interface ShopItem  {
    cost: number;
    card_id: number;
    idx: number;
    item_type: "Special" | "Modifier" | "Common";
}