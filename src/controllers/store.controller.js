import { StatusCodes } from "http-status-codes";
import { bodyNewStore } from "../dtos/store.dto.js";
import { newStore } from "../services/store.service.js";

// 클라이언트의 요청을 받아 서비스에 전달

export const handleStoreAdd = async (req, res, next) => {
  console.log("가게를 추가합니다.");
  console.log("body : ", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  // dto로 전달 객체로 바꾼 data를 통해 newStoreAt 기능 호출하여 store 생성 -> Service
  const store = await newStore(bodyNewStore(req.body));
  // 클라이언트에게 상태 코드와 함께 JSON 형식으로 사용자 정보를 포함한 res 보냄 
  res.status(StatusCodes.OK).json({ result: store });
};