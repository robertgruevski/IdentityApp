import { EditProfileBaseModel } from "./editProfileBase.model";

export interface DeleteAccountModel extends EditProfileBaseModel {
    currentUserName: string;
    confirmation: boolean;
}