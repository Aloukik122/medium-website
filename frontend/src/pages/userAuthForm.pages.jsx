 import { useRef } from 'react'
import React from 'react'
 import InputBox from '../components/inputBox.component'
 import googleIcon from '../images/google.png'
import { Link } from 'react-router-dom'
 import AnimationWrapper from '../common/page.animation'

function UserAuthForm({type}) {

	const authForm = useRef()

	const handleSubmit = (e)=>{
		e.preventDefault()

		if (!authForm.current) return;
		let form = new FormData(authForm.current)
		// console.log(form)
		let formData = {}
		for (let [key,value] of form.entries()){
			formData[key] = value
		}

// form validation copy from server.js signup

		let {fullname, email, password} = formData

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
		}


	return (
		<AnimationWrapper keyValue={type}>	

			<section className='h-cover flex justify-center items-center'>
				<form ref={authForm} className='w-[80%] max-w-100' action="">
					<h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
						
						{type == 'sign-in' ? 'Welcome back' : 'Join us today'}
					</h1>

					{
						type != 'sign-in' ? 
						<InputBox
							name='fullname'
							type='text'
							placeholder='Full Name'
							icon='fi-rr-user'
						/>
						: ''
					}

					<InputBox
						name='email'
						type='email'
						placeholder='Email'
						icon='fi-rr-envelope'
					/>

					<InputBox
						name='password'
						type='password'
						placeholder='Password'
						icon='fi-rr-key'
					/>

					<button 
						className='btn-dark center mt-14'
						type='submit'
						onClick={handleSubmit}
					>
						{
							type.replace('-', ' ')
						}
						
					</button>

					<div 
						className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
						<hr className='w-1/2 border-black'/>
						<p>or</p>
						<hr className='w-1/2 border-black'/>
					</div>

					<button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
						<img src={googleIcon} className='w-5 ' />
						continue  with google
					</button>


					{
						type == 'sign-in' ?
						<p className='mt-6 text-gray-500 text-xl text-center'>
							Don't have an account ?

							<Link to='/signup' className='underline text-black text-xl ml-1'>
								Join us today.
							</Link>
						</p>

						:
						
						<p className='mt-6 text-gray-500 text-xl text-center'>
							Already a member ?

							<Link to='/signin' className='underline text-black text-xl ml-1'>
								Sign in here.
							</Link>
						</p>
					}
						
				</form>				
				
			</section>
		
		</AnimationWrapper>
	)
}

export default UserAuthForm