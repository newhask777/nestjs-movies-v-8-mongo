import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6,
		{
			message: 'Password must be more than 6 chars!'
		}
	)
	@IsString()
	password: string
}