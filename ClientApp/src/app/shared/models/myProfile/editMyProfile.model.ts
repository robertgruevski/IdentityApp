import { EditProfileBaseModel } from "./editProfileBase.model";

export interface EditMyProfileModel extends EditProfileBaseModel {
    name: string;
    email: string;
}