import jsonwebtoken from "jsonwebtoken";

export function signToken(userId, role) {
    return jsonwebtoken.sign({userId, role}, process.env.SECRET_KEY, {
        expiresIn: "24h",
    });
}

export function encodeUser(user) {
    return jsonwebtoken.sign({user}, process.env.SECRET_KEY, {
        expiresIn: "24h",
    });
}