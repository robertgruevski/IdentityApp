import { EditProfileBaseModel } from "./editProfileBase.model";

export interface QrCodeModel {
    secret: string;
    uri: string;
}

export interface MfaEnableModel extends EditProfileBaseModel {
    secret: string;
    code: string;
}