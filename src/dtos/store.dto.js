// 클라이언트로부터 받은 body 데이터 처리
export const bodyNewStore = (body) => {
    return {
        name: body.name,
        regionId: body.regionId,
        address: body.address || "", // 빈 문자열 기본값
        telNum: body.telNum,
        foodCategoryId: body.foodCategoryId,
    };
};

// 응답 포맷팅 (store, region, foodCategory 데이터를 결합)
export const responseAddStore = ({ store, region, foodCategory }) => {
    const storeData = store; // Prisma에서 반환되는 단일 객체
    const regionData = region; // 단일 객체
    const foodCategoryData = foodCategory; // 단일 객체

    return {
        id: storeData.id,
        name: storeData.name,
        address: storeData.address,
        telNum: storeData.telNum, // Prisma 모델에서의 필드명
        status: storeData.status,
        region: regionData, // 지역 데이터
        foodCategory: foodCategoryData, // 음식 카테고리 데이터
    };
};
