import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateDto } from './dto/update'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UserService {

	constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {

	}

	// Find User By Id
	async byId(_id:string) {
		const user = await this.UserModel.findById(_id)
		if(!user) throw new NotFoundException('User not found!')
		return user
	}

	// Update User Profile
	async updateProfile(_id: string, data: UpdateDto) {
		const user = await this.UserModel.findById(_id)
		const isSameUser = await this.UserModel.findOne({ email: data.email })

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Email busy')
		}

		if (user) {
			if (data.password) {
				const salt = await genSalt(10)
				user.password = await hash(data.password, salt)
			}
			user.email = data.email
			if (data.isAdmin || data.isAdmin === false) user.isAdmin = data.isAdmin

			await user.save()
			return user
		}

		throw new NotFoundException('User not found')
	}

	// Get All Users Count
	async getCount() {
		return this.UserModel.find().countDocuments().exec()
	}

	// Get All Users
	async getAll(searchTerm?:string) {
		let options = {}

		if(searchTerm)
			options = {
				$or: {
					email: new RegExp(searchTerm, 'i')
				}
		}

		return this.UserModel.find(options).select('-password -updatedAt -__v').sort({createdAt: 'desc'}).exec()
	}

	// Delete User
	async deleteUser(id:string) {
		return this.UserModel.findByIdAndDelete(id).exec()
	}


}
