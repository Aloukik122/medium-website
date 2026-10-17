import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'


// schema bellow
import User from './Schema/User.js'



const server = express()
let PORT = 3000

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// console.log(emailRegex.test("user@example.com")); // true
// console.log(passwordRegex.test("StrongP@ss123")); // true   

server.use(express.json())

mongoose.connect(process.env.DB_URI, {
	autoIndex: true
})


// const formatDataToSend = () =>{
// 	return {
// 		profile_img : user.personal_info.profile_img,
// 		username : user.personal_info.username,
// 		fullname : user.personal_info.fullname
// 	}
// }

// username generate

const generateUsername = async (email) =>{

	let username = email.split("@")[0];

	let isUsernameNotUnique = await User.exists({"personal_info.username" : username}).then((result) => result)

	isUsernameNotUnique ? username += nanoid().substring(0, 5): "";
	return username
}


server.post('/signup', (req, res) =>{
	
	let { fullname, email, password } = req.body

//validating the data from frontend

	if( fullname.length < 3 ){
		return res.status(403).json({"error": "Fullname must be at least 3 letter long"})
	}
	if( !email.length ){
		return res.status(403).json({"error": "Enter email"})
	}
	if( !emailRegex.test(email) ){
		return res.status(403).json({"error": "invalid email"})
	}
	if( !passwordRegex.test(password) ){
		return res.status(403).json({"error": "Password should be 6 to 20 character long with a numaric, 1 lowercase, 1 uppercase letter and special character "})
	}


// password hashing and user data storing in db 

	bcrypt.hash(password, 10, async (err, hash_password)=>{
		let username = await generateUsername(email)

		let user = await new User({
			personal_info : {fullname, email, username , password: hash_password}
		})

		user.save().then((u) =>{
			return res.status(200).json({"user": u})
		})
		.catch(err =>{

			if(err.code == 11000 ){
				return res.status(500).json({"error": err.message})
			}
			return res.status(500).json({"error": err.message})
		})

	})
})

server.listen(PORT, ()=>{
	console.log('listening on -> ' + PORT)
})