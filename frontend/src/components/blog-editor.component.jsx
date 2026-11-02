import {Link} from 'react-router-dom'
import logo from '../images/logo.png'
import defaultBanner from '../images/blog banner.png'
import AnimationWraper from '../common/page.animation'
import uploadImage from '../common/aws'
import { useContext, useEffect, useRef } from 'react'
import {Toaster, toast} from 'react-hot-toast'
import Editor, { EditorContext } from '../pages/editor.pages'
import EditorJS from '@editorjs/editorjs'
import { tools } from './tools.components'

const BlogEditor = () =>{

	// let blogBannerRef = useRef()
	//destructured i used it {...blog} to get data in  handleTitleChange
	let { blog, blog: {title, banner, content, tags, des}, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext) 


	useEffect(()=>{
		setTextEditor(new EditorJS({
			holder: "textEditor",
			data : content,
			tools : tools,
			placeholder : "Let's write awesome story" 
		}))
	},[])

	const handleBannerUpload = (e) =>{
		let img = e.target.files[0]

		if(img){

			let loadingToast = toast.loading('Uploading...')

			uploadImage(img).then((url) => {
				if(url){
					toast.dismiss(loadingToast)
					toast.success('Uploaded Successfully')
					setBlog({ ...blog, banner: url })
				}
			})
			.catch(err =>{
				toast.dismiss(loadingToast)
				return toast.error(err)
			})
		}
		// console.log(img)
	}

	const handleTitleKeyDown = (e) =>{
		// console.log(e)
		if (e.keyCode == 13){
			e.preventDefault()
		}
	}

	const handleTitleChange =(e) =>{
		// console.log(e)

		let input = e.target
		// console.log(input.scrollHeight)

		input.style.height ='auto'
		input.style.height = input.scrollHeight + 'px'

		setBlog({ ...blog, title: input.value  })
	}

const handleDescriptionChange = (e) => {
    setBlog({ ...blog, des: e.target.value });
}


const handleError = (e) =>{
	let img = e.target

	img.src = defaultBanner
}


const handlePublishEvent = () =>{
	// if (!banner.length){
	// 	return toast.error('Upload a banner to publish it')
	// }

	// if(!title.length){
	// 	return toast.error('Write blog title to publish it')
	// }

	if(textEditor.isReady){
		textEditor.save().then((data) =>{
			
			console.log(data.blocks)


			if(data.blocks.length){
				setBlog({ ...blog, content: data})
				setEditorState("publish")
			}else{
				return toast.error("Write somthing in yout blog to publish")
			}
		})
		.catch((err)=>{
			console.log(err)
		})
	}
}
	return (
		<>
			<nav className=" navbar">
				
				<Link to='/' className='flex-none w-10' >
					<img src={logo}/>
				</Link>

				<p className='max-md:hidden text-black line-clamp-1 w-full'>
					{ title.length ? title : 'New Blog' }
					
				</p>

				<div className='flex gap-4 ml-auto'>
					<button 
						className='btn-dark py-2 '
						onClick={handlePublishEvent}
					>
						Publish
					</button>
					<button className='btn-light py-2 '>
						Save draft
					</button>
				</div>
			</nav>

			<Toaster/>
			<AnimationWraper>
				<section>
					<div className='mx-auto max-w-225 w-full'>

						<div className='relative aspect-video hover:opacity-80 bg-white border-4 border-r-gray-300'>
							<label htmlFor="uploadBanner">
								<img 	
									// ref={blogBannerRef}
									src={banner || null}
									className='z-20'
									onError={handleError}
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

						<textarea
							defaultValue={title}
							placeholder='Blog Title'
							className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40' 
							onKeyDown={handleTitleKeyDown}
							onChange={handleTitleChange}

						></textarea>
						<hr className='w-full opacity-10 my-5'/>
						
						
						<div 
							id='textEditor' 
							className='font-gelasio'>
							
						</div>


					</div>
				</section>
			</AnimationWraper>

		</>
	)
}

export default BlogEditor