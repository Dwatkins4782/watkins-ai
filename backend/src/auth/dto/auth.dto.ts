import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

  @IsString()
    @MinLength(8)
    password: string;

  @IsString()
    firstName: string;

  @IsString()
    @IsOptional()
    lastName?: string;

  @IsString()
    @IsOptional()
    tenantName?: string;

  @IsString()
    @IsOptional()
    company?: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

  @IsString()
    password: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    token: string;

  @IsString()
    @MinLength(8)
    newPassword: string;
}

export class VerifyEmailDto {
    @IsString()
    token: string;
}

export class ChangePasswordDto {
    @IsString()
    currentPassword: string;

  @IsString()
    @MinLength(8)
    newPassword: string;
}
