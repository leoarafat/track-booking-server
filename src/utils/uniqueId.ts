const usedCodes = new Set();
export function generateArtistId() {
  let code;

  do {
    code = Math.floor(1000 + Math.random() * 9000);
  } while (usedCodes.has(code));

  usedCodes.add(code);

  return code;
}

//! Transaction id
export function generateTransactionId() {
  const timestamp = new Date().getTime().toString(36);
  const randomString = Math.random().toString(36).substr(2, 5);

  return `${timestamp}${randomString}`.toUpperCase();
}
export function generateExternalId() {
  const timestamp = new Date().getTime().toString(36);
  const randomString = Math.random().toString(36).substr(2, 8);

  return `${timestamp}${randomString}`.toUpperCase();
}

// import { User } from "../models/user.model.js";

// const findLastHomeOwnerId = async () => {
//   const lastId = await User.findOne({ role: "homeowner" })
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastId?.id ? lastId?.id : undefined;
// };

// export const generateNewHomeOwnerId = async () => {
//   let currentId = (0).toString();
//   const lastHomeOwner = await findLastHomeOwnerId();

//   if (lastHomeOwner) {
//     currentId = lastHomeOwner.substring(10);
//   }
//   console.log(currentId);
//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `homeowner-${incrementId}`;

//   return incrementId;
// };
