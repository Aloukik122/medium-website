import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth';
import serviceAccountKey from './firebase-google.json' with { type: 'json' };
import pkg from 'firebase-admin'
import aws from 'aws-sdk'

// schema bellow
import User from './Schema/User.js'
import Blog from './Schema/Blog.js'



const server = express()
let PORT = 3000

initializeApp({
	credential: cert(serviceAccountKey)
})

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// console.log(emailRegex.test("user@example.com")); // true
// console.log(passwordRegex.test("StrongP@ss123")); // true   

server.use(cors())
server.use(express.json())


mongoose.connect(process.env.DB_URI, {
	autoIndex: true
})


// setting s3 bucket

const s3 = new aws.S3({
	region: 'ap-southeast-2',
	accessKeyId: process.env.AWS_ACCESS_KEY ,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


const generateUploadURL = async (imageType = 'jpeg') =>{ 

	const date = new Date()
	const imageName = `${nanoid()}-${date.getTime()}.${imageType}`

	return await s3.getSignedUrlPromise('putObject', {
		Bucket: 'medium-blogging-websiteimages',
		Key : imageName,
		Expires : 1000,
		ContentType: `image/${imageType}`
	})

}

const verifyJWT = (req, res, next) =>{

	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(" ")[1]

	if(token == null){
		return res.status(401).json({error: 'No acess token'})
	}

	jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) =>{
		if (err){
			return res.status(403).json({error: 'access token is invalid'})
		}

		req.user = user.id
		next()
	})

}


const formatDataToSend = (user) =>{

	const access_token = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY ) //use node and then -- require('crypto').randomBytes(64).toString('hex')

	return {
		access_token,
		profile_img : user.personal_info.profile_img,
		username : user.personal_info.username,
		fullname : user.personal_info.fullname,
	}
}

// username generate

const generateUsername = async (email) =>{

	let username = email.split("@")[0];

	let isUsernameNotUnique = await User.exists({"personal_info.username" : username}).then((result) => result)

	isUsernameNotUnique ? username += nanoid().substring(0, 5): "";
	return username
}




// upload image URL route
server.get('/get-upload-url',(req, res)=>{

	let imgType = req.query.type || 'jpeg';

	generateUploadURL(imgType).then(url => res.status(200).json({uploadURL : url}))

	.catch(err => {
		console.log(err.message)
		return res.status(500).json({error : err.message})
	})

	
})



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

		let user = new User({
			personal_info : {fullname, email, username , password: hash_password}
		})

		user.save().then((u) =>{
			return res.status(200).json(formatDataToSend(u)) // chnaged ('user': u) not sending the whole data
		})
		.catch(err =>{

			if(err.code == 11000 ){
				return res.status(500).json({"error": err.message})
			}
			return res.status(500).json({"error": err.message})
		})

	})
})

//sign-in post for server

server.post('/signin',(req,res)=>{
	let {email , password} = req.body

	User.findOne({ 'personal_info.email': email })
	.then((user)=>{
		if(!user){
			return res.status(403).json({'error': 'email not found'})
		}

		if(!user.google_auth){

			bcrypt.compare(password, user.personal_info.password, (err, result)=>{
				if(err){
					return res.status(403).json({'error': ' error occured while login'})
				}
				if(!result){
					return res.status(403).json({'error': 'incorrect password '})
				}else{
				 	return res.status(200).json(formatDataToSend(user))	
				}
			})

		}else{
			return res.status(403).json({"error": "Account was created using google. Try logging it with google"})
		}

		
		
	})

	.catch(err =>{
		console.log(err.message)
		return res.status(500).json({'error': err.message})
	})

}) 


server.post('/google-auth', async (req,res)=>{
	let { access_token } = req.body

	getAuth()
	.verifyIdToken(access_token)
	.then(async (decodedUser) =>{

		let {email, name, picture } = decodedUser

// to get the high resolution image from the google profile use the same code

		picture = picture.replace("s96-c", "s384-c") 

		let user =  await User.findOne({'personal_info.email': email}).select("personal_info.fullname personal-info.username personal_info.profile_img google_auth").then((u)=>{
			return u || null
		})
		.catch(err =>{
			return res.status(500).json({"error": err.message})
		})
		if(user){
			if(!user.google_auth){
				return res.status(403).json({"erroe": "This email was signes up without google. please log in with password"})
			}
		}
		else{
			let username = await generateUsername(email)
			user = new User({
				personal_info : { fullname: name, email, profile_img: picture, username },
				google_auth: true
			})

			await user.save().then((u)=>{
				user = u
			})
			.catch(err =>{
				return res.status(500).json({"error": err.message})
			})
		}

		return res.status(200).json(formatDataToSend(user))
	})
	.catch(err=>{
		return res.status(500).json({"error":"failed to authenticate with google, try with other account"})
	})
})

server.post('/create-blog', verifyJWT, (req,res) =>{
	// console.log(req.body)

	let authorId = req.user

	let { title, des, banner, tags, content, draft } = req.body

	if(!title.length){

		return res.status(403).json({error: 'you munst provide a title to publish the blog'})
	}

	if(!des.length){

		return res.status(403).json({error: 'you munst provide a descreption of 200 letters to publish the blog'})
	}

	if(!banner.length){

		return res.status(403).json({error: 'you munst provide a banner to publish the blog'})
	}

	if(!title.length){

		return res.status(403).json({error: 'you munst provide a title to publish the blog'})
	}

	if(!tags.length || tags.length > 10){

		return res.status(403).json({error: 'you munst provide a tags to publish the blog'})
	}


	tags = tags.map(tag => tag.toLowerCase())

	let blogId = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid()
	// console.log(blogId)

	let blog

	return res.json({status: "done"})
	
})


server.listen(PORT, ()=>{
	console.log('listening on -> ' + PORT)
})