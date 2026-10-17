import { useState } from 'react'
import logo from '../images/logo.png'
import {Link, Outlet} from 'react-router-dom'

const Navbar = () =>{

	const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)

	return (
		<>
			<nav className="navbar">

				<Link className='flex-none w-10'>
					<img src={logo} className='w-full' />
				</Link>

				<div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-gray-200 py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto  ' + (searchBoxVisibility ? 'show ' : 'hidden md:show' )}>
					<input 
						type="text"
						placeholder='Search'
						className='w-full rounded-full  md:w-auto bg-gray-100 p-4 pl-6 pr-[12%] md:pr-6 placeholder:text-gray-500 md:pl-12'
					/>
					<i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-gray-500"></i>
				</div>

				<div className='flex items-center gap-3 md:gap-6 ml-auto'>
					<buttton 
						className='md:hidden bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center'

						onClick={()=>setSearchBoxVisibility(currentVal => !currentVal)}

					>
						<i className="fi fi-br-search text-xl"></i>
					</buttton>
					

{/*top buttons for writer, signin and signup*/}

					<Link to='/editor' className='hidden md:flex gap-2 link'>
						<i className="fi fi-rr-file-edit"></i>
						<p>Write</p>
					</Link>

					<Link to='/signin' className='btn-dark py-2'>
						Sign In
					</Link>

					<Link to='/signup' className='btn-light py-2 hidden md:block'>
						Sign Up 
					</Link>

				</div>
			</nav>

			<Outlet/>
		</>
	)
}

export default Navbar;