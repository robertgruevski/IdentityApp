import { EditProfileBaseModel } from "./editProfileBase.model";

export interface ChangePasswordModel extends EditProfileBaseModel {
    newPassword: string;
}