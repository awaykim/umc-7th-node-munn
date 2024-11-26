import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
    findUserByEmail,
} from "../repositories/user.repository.js";

import { comparePassword } from "../services/auth.service.js";

// 보내준 데이터를 이용해서 실제 로직을 구현

// 회원가입 로직
// DB에 user(member) 추가하는 addUser 호출 -> repo
export const userSignUp = async (data) => {
    console.log("service data: ", data);
    const joinUserId = await addUser({
        email: data.email,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        specAddress: data.specAddress,
        phoneNum: data.phoneNum,
        password: data.password,
    });

    
    if (joinUserId === null) {
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

    for (const preference of data.preferences) {
        await setPreference(joinUserId, preference);
    }

    // joinUserId를 통해 user 가져오기
    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    // user를 통해서 user response 생성, 반환
    return responseFromUser({ user, preferences });
};

export const validateUserLogin = async (data) => {
    const user = await findUserByEmail(data.email);
    if (!user) {
        throw new Error("User not found");
    }

    // 비밀번호 비교
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    return user;
};
