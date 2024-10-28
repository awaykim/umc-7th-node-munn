export const bodyNewStore = (body) => {
    return {
        name: body.name,
        regionId: body.regionId,
        address: body.address || "",
        telNum: body.telNum,
        foodCategoryId: body.foodCategoryId,
    };
}

export const responseAddStore = ({store, region, foodCategory}) => {
    const storeData = store[0];
    const regionData = region[0];
    const foodCategoryData = foodCategory[0];
    return {
        id: storeData.id,
        name: storeData.name,
        address: storeData.address,
        telNum: storeData.tel_num,
        status: storeData.status,
        region: regionData,
        foodCategory: foodCategoryData,
    }
}