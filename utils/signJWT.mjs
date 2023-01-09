import jsonwebtoken from "jsonwebtoken";

export default function signToken(userId) {
  return jsonwebtoken.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
}
