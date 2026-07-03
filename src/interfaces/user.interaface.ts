import { EGender } from "../enums/gender.enum";
import { EUserStatus } from "../enums/user-status.enum";

export interface IUser {
  id: number;
  email: string;
  firstName: string;
  cnic:string;
  lastName: string;
  phoneNumber: string;
  status: EUserStatus;
  gender: EGender | null;
  isGuest: boolean;
}
