export class ResetPasswordModel {
    email: string;
    token: string;
    newPassword: string;

    constructor(email: string, token: string, newPassword: string) {
        this.email = email;
        this.token = token;
        this.newPassword = newPassword;
    }
}