import jsonwebtoken from "jsonwebtoken";

export default function signToken(userId, role) {
  return jsonwebtoken.sign({ userId , role}, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
}
