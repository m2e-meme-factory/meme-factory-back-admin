import { IsInt, IsPositive, IsDecimal, Min, Max } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  projectId: number;

  @IsInt()
  taskId: number;

  @IsInt()
  fromUserId: number;

  @IsInt()
  toUserId: number;

  @IsDecimal()
  @IsPositive()
  @Min(0)
  @Max(1000000)
  amount: number;
}
