// File for firebase node set up 
import { ref, set } from "firebase/database";
import { db } from "../firebase";

export const createAdmin = (adminId, data) => {
  set(ref(db, `admin/${adminId}`), data);
};
