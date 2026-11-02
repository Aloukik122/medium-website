import axios from 'axios'


const uploadImage = async (img) =>{

	let imgUrl = null

	let extension = img.type.split('/')[1];

	await axios.get(import.meta.env.VITE_SERVER_DOMAIN +"/get-upload-url?type=" + extension)
	.then( async ({ data : {uploadURL}}) =>{

		await axios({
			method : 'PUT',
			url : uploadURL,
			headers: { 'Content-Type': img.type },
			data : img
		})
		.then(() =>{
			// console.log(uploadURL)
			// https://website.com/img.jpeg?key&Content-Type=image only need url

			imgUrl = uploadURL.split('?')[0]
		})
	})

	return imgUrl
}

export default uploadImage