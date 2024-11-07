import { responseAddStore } from "../dtos/store.dto.js";
import { addStore, getStore, getRegion, getFoodCategory } from "../repositories/store.repository.js";

export const newStore = async (data) => {
    const joinStoreId = await addStore({
        name: data.name,
        regionId: data.regionId,
        address: data.address || "",
        telNum: data.telNum,
        foodCategoryId: data.foodCategoryId,
    });

    // joinStoreId를 통해 store 가져오기
    const store = await getStore(joinStoreId);
    const region = await getRegion(joinStoreId);
    const foodCategory = await getFoodCategory(joinStoreId);
    // store를 통해서 store response 생성, 반환
    return responseAddStore({ store, region, foodCategory });
};
