import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    return jwt.sign(payload, secret, { expiresIn });
};

export const hashPassword = async (password) => {
    const saltRounds = 10; // 해싱 복잡도 설정
    return await bcrypt.hash(password, saltRounds);
};

// 비밀번호 비교 함수
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};