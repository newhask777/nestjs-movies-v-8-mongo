import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'

export class IdvalidationPipe implements PipeTransform {
	transform(value: any, meta: ArgumentMetadata) {
			if(meta.type != 'param') return value

			if(!Types.ObjectId.isValid(value)) throw new BadRequestException('Invalid format id')

			return value
	}
}