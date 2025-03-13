import { ApiProperty } from "@nestjs/swagger";

export class ReturnMsg {
    @ApiProperty({ description: 'Message' })
    msg: string
}