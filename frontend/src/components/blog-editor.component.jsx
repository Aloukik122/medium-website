import {Link} from 'react-router-dom'
import logo from '../images/logo.png'
import defaultBanner from '../images/blog banner.png'
import AnimationWraper from '../common/page.animation'



const BlogEditor = () =>{

	const handleBannerUpload = (e) =>{
		let img = e.target.files[0]
		console.log(img)

	}

	return (
		<>
			<nav className=" navbar">
				
				<Link to='/' className='flex-none w-10' >
					<img src={logo} alt=""/>
				</Link>

				<p className='max-md:hidden text-black line-clamp-1 w-full'>
					New Blog
				</p>

				<div className='flex gap-4 ml-auto'>
					<button className='btn-dark py-2 '>
						Publish
					</button>
					<button className='btn-light py-2 '>
						Save draft
					</button>
				</div>
			</nav>

			<AnimationWraper>
				<section>
					<div className='mx-auto max-w-225 w-full'>

						<div className='relative aspect-video hover:opacity-80 bg-white border-4 border-r-gray-300'>
							<label htmlFor="uploadBanner">
								<img 
									src={defaultBanner} 
									className='z-20'
								/>
								<input 
									type="file"
									id='uploadBanner'
									accept='.png, .jpg, jpeg'
									hidden
									onChange={handleBannerUpload}
								/>
							</label>
						</div>
						
					</div>
				</section>
			</AnimationWraper>

		</>
	)
}

export default BlogEditor