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
  const member = user[0]
  console.log("user:", member)
    return {
      id: member.id,
      email: member.email,
      name: member.name,
      gender: member.gender,
      birth: member.birth,
      address: {
        main: member.address,
        detail: member.spec_address,
      },
      phoneNumber: member.phone_num,
      preferences: preferences,
    };
  };