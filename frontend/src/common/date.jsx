let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]
let days = ["Sunday","Monday","Tusday","Wednesday","Thursday","Friday","Saturday"]

export const getDay = (timestam)=>{

	let date = new Date(timestam);

	return `${date.getDate()} ${months[date.getMonth()]}`

}