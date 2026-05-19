import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ContactDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(2, 80, { message: 'Имя должно быть от 2 до 80 символов' })
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^[+\d][\d\s\-()]{6,20}$/, {
    message: 'Некорректный телефон',
  })
  phone!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Некорректный email' })
  email!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  comment?: string;

  // Honeypot — bots fill this, humans don't
  @IsOptional()
  @IsString()
  website?: string;
}
