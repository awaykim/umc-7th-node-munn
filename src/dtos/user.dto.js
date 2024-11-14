// 입력 데이터를 정형화된 형태로 파싱, 검증

// 사용자에게 받은 body를 하나의 Json 객체로 변환
export const bodyToUser = (body) => {
    const birth = new Date(body.birth);
    return {
        email: body.email,
        name: body.name,
        gender: body.gender,
        birth,
        address: body.address || "",
        specAddress: body.specAddress || "",
        phoneNum: body.phoneNum,
        preferences: body.preferences,
    };
};

// 사용자에게 유저 정보를 전달하는 객체
export const responseFromUser = ({ user, preferences }) => {
    const preferFoods = preferences.map(
        (preference) => preference.foodCategory.name
    );

    return {
        email: user.email,
        name: user.name,
        preferCategory: preferFoods,
    };
};
