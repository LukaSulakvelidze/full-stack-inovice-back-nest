import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  fullName: string;
  @IsString()
  @Length(8, 20)
  password: string;
}
