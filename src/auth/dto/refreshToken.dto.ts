import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RefreshTokenDto {
	@ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIyIiwiaWF0IjoxNzI2MjI5ODQxLCJleHAiOjE3Mjc1MjU4NDF9.PVsvy3Pbow4uJywYQJ-umxP85FuhDJ63gzi5DICyVTU", description: 'Refresh token пользователя' })
	@IsString({
		message: 'You did not pass refresh token or it is not a string!'
	})
	refreshToken: string
}
