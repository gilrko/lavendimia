import axios from 'axios';
import URIS from './Uris';

const SERVICES = {
	async getDate() {
		var dateDay = new Date().getDate();
		var dateMonth = new Date().getMonth() + 1;
		var dateYear = new Date().getFullYear()
		let date = dateDay+"/"+dateMonth+"/"+dateYear;
			return date

		
	},

	//users
	async users() {
		try {
			let response = await axios.get(URIS.users);
		
			return response.data

		} catch (error) {
			return error
		}
	},
	async create_client(name,lastname,motherlastname,rfc) {
		try {
			let response = await axios.post(URIS.create_client,{id: 0,name: name,
			lastname: lastname,motherlastname: motherlastname,rfc: rfc});
		
			return response.data

		} catch (error) {
			return error
		}
	},
	async update_client(id,name,lastname,motherlastname,rfc) {
		try {
			let response = await axios.put(`${URIS.update_client}/${id}`,{name: name,
			lastname: lastname,motherlastname: motherlastname,rfc: rfc});
		
			return response.data

		} catch (error) {
			return error
		}
	},
	//Articles
	async articles() {
		try {
			let response = await axios.get(URIS.articles);
		
			return response.data

		} catch (error) {
			return error
		}
	},
	async create_article(description,model,stock,price) {
		try {
			let response = await axios.post(URIS.create_article,{id: 0,description: description,
				model: model,stock: stock,price: price});
		
			return response.data

		} catch (error) {
			return error
		}
	},
	async update_article(id,description,model,price,stock) {
		try {
			let response = await axios.put(`${URIS.update_article}/${id}`,{description: description,
				model: model,stock: stock,price: price});
		
			return response.data

		} catch (error) {
			return error
		}
	},
	//SALES
	async sales() {
		try {
			let response = await axios.get(URIS.sales);
		
			return response.data

		} catch (error) {
			return error
		}
	},
}

export default SERVICES