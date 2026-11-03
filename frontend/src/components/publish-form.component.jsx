import toast, { Toaster } from "react-hot-toast"
import AnimationWrapper from "../common/page.animation"
import { useContext, useEffect, useRef } from "react"
import { EditorContext } from "../pages/editor.pages"
import EditorJS from '@editorjs/editorjs';
import { tools } from "./tools.components";
import Tag from "./tags.components";

const PublishForm = () =>{



	let characterLimit = 200
	let tagLimit = 10

	let {blog, blog : { banner, title, tags, des,content },setBlog , setEditorState } = useContext(EditorContext)



const previewEditorRef = useRef(null);
 useEffect(() => {
        if (content && content.blocks && content.blocks.length > 0) {
            // Initialize WITHOUT readOnly
            previewEditorRef.current = new EditorJS({
                holder: 'publishEditor',
                data: content,
                tools: tools,
                placeholder: "Edit your content here...",
            });
        }
        return () => {
            if (previewEditorRef.current && previewEditorRef.current.destroy) {
                previewEditorRef.current.destroy();
                previewEditorRef.current = null;
            }
        };
    }, [content]);

  const handleFinalPublish = async () => {
        if (previewEditorRef.current) {
            // Save the newly edited data from the preview editor
            const savedData = await previewEditorRef.current.save();
            
            // Update your context with the final, edited data
            setBlog({ ...blog, content: savedData });
            
            // Call your API to push to database here...
            console.log("Final Data to send to API:", { ...blog, content: savedData });
        }
    };



	const handleCloseEvent = () => {

		setEditorState("editor")
	}


	const handleBlogTitleChange = (e) =>{
		let input = e.target

		setBlog({...blog,title: input.value})
	}

	const handleBlogDesChange = (e) =>{
		let input = e.target
		// console.log(e)
		setBlog({ ...blog,des: input.value })
	}

	const handleKeyDown = (e) =>{
		// console.log(e.keyCode)

		if(e.keyCode == 13 || e.keyCode == 188) {
			e.preventDefault()

			let tag = e.target.value

			// console.log(tag)

			if(tags.length < tagLimit ){
				if(!tags.includes(tag) && tag.length){
					setBlog({ ...blog , tags : [...tags, tag]})
				}
			} else{
				toast.error(`you can add manx ${tagLimit}`)
			}
			e.target.value = ''
		} 

	}

	return (

		<AnimationWrapper>
			<section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
				
				<Toaster/>

				<button 
					className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]  "
					onClick={handleCloseEvent}
				>
					<i className="fi fi-br-cross"/>

				</button>

				<div className=" max-w-[550px] center ">
					<p className="text-gray-500 mb-1">Peview</p>

					<div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-300 mt-4">
						<img src={banner}/>
					</div>

					<h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{ title }</h1>
					<p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{ des }</p>

				</div>



				{/*<div className="border-gray-300 lg:border lg:pl-8">
					
					<p className="text-gray-500 mb-2 mt-9">Blog Title</p>
					<input 
						type="text" 
						placeholder="Blog Title"
						className="input-box pl-4"
						defaultValue={title}
						onChange={handleBlogTitleChange}
					/>
					<p className="text-gray-500 mb-2 mt-9">Short description about your blog</p>
					<textarea
						maxLength={characterLimit} 
						value={des || ""}
						className="h-40 resize-none leading-7 input-box pl-4"
						onChange={handleBlogDesChange}

					>
					</textarea>

				</div>*/}


				<div className=" lg:border p-8">
		            <p className="text-gray-500 mb-2 mt-9">Blog Title</p>
		            <input 
						type="text" 
						placeholder="Blog Title"
						className="input-box pl-4"
						value={title}
						onChange={handleBlogTitleChange}
					/>
		            {/*<h1 
		            	className="text-4xl font-medium mt-2 leading-tight">{title}</h1>*/}
		            
		            <p className="text-gray-500 mb-2 mt-9">Short description about your blog</p>
		            <div 
		            	id="publishEditor" 
		            	className=" font-gelasio  border-b border-gray-200"
		            ></div>

		            {/*<p className="">{ characterLimit - des.length } character left</p>*/}
		            

		            <p className="text-gray-500 text-sm mt-9">Topic - ( Helps searching and ranking your blog )</p>

		            <div className=" relative input-box pl-2 py-2 pb-4 ">
		            	<input type="text" placeholder=" Topic " className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 " 
		            		onKeyDown={handleKeyDown}

		            	/>
		            	

		            	{
		            		tags.map((tag, i) => {
		            			return <Tag tag={tag} key={i} tagIndex={i} />
		            		})
		            	}

		            </div>

		            <p className=" mt-1 mb-4 text-gray-500 text-right ">{ tagLimit - tags.length } Tags left</p>

		            {/* Example Final Publish Button */}
		            <button onClick={handleFinalPublish} className="btn-dark mt-5 px-8">
		                Final Publish
		            </button>

		        </div>


			</section>
		</AnimationWrapper>
	)
}

export default PublishForm