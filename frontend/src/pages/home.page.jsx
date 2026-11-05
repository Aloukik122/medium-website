import { useEffect, useState } from "react"
import AnimationWrapper from "../common/page.animation"
import InPageNavigation from "../components/inpage-navigation-component"
import axios from 'axios'
import Loader from "../components/loader.components"
import BlogPostCard from "../components/blog-post.component"


const HomePage = () =>{


	let [ blogs, setBlogs ] = useState(null)

	const fetchLatestBlogs = () =>{
		axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
		.then(({data}) =>{
			setBlogs(data.blogs)
		})
		.catch(err =>{
			console.log(err)
		})
	}

	useEffect(()=>{
		fetchLatestBlogs()
	},[])


	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10 ">
{/*latest blog*/}
				<div className="w-full ">
					
					<InPageNavigation routes={[ "home", "trending blog" ]} defaultHidden={["trending blog"]}>

						<>
							{
								blogs == null  ? <Loader /> 
								:
								blogs.map((blog, i)=>{
									return <AnimationWrapper transition={{duration: 1, delay: i*.1}} key={i} > 
										<BlogPostCard content={blog} author={blog.author.personal_info}/>

									</AnimationWrapper>
								})
							}
						</>


						<h1>trending blog</h1>
						
					</InPageNavigation>

				</div>

{/*filter and trending blog*/}
				<div>
					

				</div>

			</section>
		</AnimationWrapper>
	)
}

export default HomePage