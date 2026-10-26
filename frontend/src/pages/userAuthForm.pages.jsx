import { useContext, useRef } from 'react'
import React from 'react'
import InputBox from '../components/inputBox.component'
import googleIcon from '../images/google.png'
import { data, Link, Navigate, ServerRouter } from 'react-router-dom'
import AnimationWrapper from '../common/page.animation'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { storeInSession } from '../common/session'
import { UserContext } from '../App'
import { authWithGoogle } from '../common/firebase'


function UserAuthForm({type}) {

	const authForm = useRef()

	let { userAuth: {access_token}, setUserAuth } = useContext(UserContext)

	console.log(access_token)

	const userAuthThroughServer = (serverRoute, formData) =>{

// frontend and backend running on diff ports so we use (core)

		axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
		.then(({data})=>{
			storeInSession('user', JSON.stringify(data))

			setUserAuth(data)
			// console.log(sessionStorage)
		})
		.catch(({response})=>{
		toast.error(response.data.error)
	})
	
}

	const handleSubmit = (e)=>{
		e.preventDefault()

		let serverRoute = type == 'sign-in' ? '/signin' : '/signup';

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


//formData
		let form = new FormData(formElement)
		// console.log(form)

		let formData = {}
		for (let [key,value] of form.entries()){
			formData[key] = value
		}

		// console.log(formData)

// form validation copy from server.js for signup and signin

		let {fullname, email, password} = formData

// signin has 2 input but signup has 3 input 

		if(fullname){
			if( fullname.length < 3 ){
			return toast.error("Fullname must be at least 3 letter long")
			}
		}
		if( !email.length ){
			return toast.error("Enter email")
		}
		if( !emailRegex.test(email) ){
			return toast.error( "invalid email")
		}
		if( !passwordRegex.test(password) ){
			return toast.error( "Password should be 6 to 20 character long with a numaric, 1 lowercase, 1 uppercase letter and special character ")
		}

		userAuthThroughServer(serverRoute, formData)
	}


const handleGoogleAuth = (e) => {
    e.preventDefault()

    authWithGoogle().then((access_token) => {
        let serverRoute = "/google-auth";

        let formData = {
            access_token
        };
        userAuthThroughServer(serverRoute, formData);
    })
    .catch(err => {
        toast.error('trouble login through google');
        return console.log(err);
    });
}


	return (

		access_token ? 
		<Navigate to='/'/>

		:
		 
		<AnimationWrapper keyValue={type}>	

			<section className='h-cover flex justify-center items-center'>

{/*for alert use toster*/}
				<Toaster /> 
				<form id='formElement' className='w-[80%] max-w-100' action="">
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

					<button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
						onClick={handleGoogleAuth}
					>
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