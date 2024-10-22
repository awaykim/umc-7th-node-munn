import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

// 보내준 데이터를 이용해서 실제 로직을 구현

// 회원가입 로직 
// DB에 user(member) 추가하는 addUser 호출 -> repo
export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    specAddress: data.specAddress,
    phoneNum: data.phoneNum,
  });
  
  // 이미 존재하는 이메일의 경우 addUser되지 않는다. (repo 로직)
  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
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