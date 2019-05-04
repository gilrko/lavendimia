import { AsyncStorage } from 'react-native'
import { showMessage } from 'react-native-flash-message';

const SHOPPINGCART = {
	async addToCart(object) {
		try {
      console.log("PRODUCT -->",object)
			await AsyncStorage.getItem('SHOPPINGCART', (err, result) => {
				let response
				let flag = false
				result ? response = JSON.parse(result) : response = []
				if (response.length > 0) {
					for (let i = 0; i < response.length; i++) {
						if (response[i].cod_prod === object.cod_prod && response[i].colorSelect === object.colorSelect && response[i].sizeSelect === object.sizeSelect ) {
							response[i].quantity += object.quantity
							if(response[i].prices){
								response[i].priceCart = response[i].prices.current * response[i].quantity
								flag = true
							}else{
								response[i].priceCart = response[i].price * response[i].quantity
							  flag = true
							}
						}
					}
					if (!flag){
						if (object.prices) {
							object.priceCart = object.prices.current * object.quantity
							response.push(object)
						}else{
							object.priceCart = object.price * object.quantity
							response.push(object)
						}
					}
				} else {
					if(object.prices){
						object.priceCart = object.prices.current * object.quantity
						response.push(object)
					}else{
						object.priceCart = object.price * object.quantity
						response.push(object)
					}
					
				}
				AsyncStorage.setItem('SHOPPINGCART', JSON.stringify(response), () => {
					AsyncStorage.getItem('SHOPPINGCART', (err, result) => {
						console.log("Add to cart 2", JSON.parse(result));
						showMessage({
							message: "Se agrego al carrito",
							type: "success"
						});
					});
				});
			});
		} catch (error) {
			console.log("No se puede guardar el carrito -->", error)
		}
	},
	async getProducts(){
		try {
			await AsyncStorage.getItem('SHOPPINGCART', (err, result) => {
				console.log("REsult -->",result)
				return JSON.parse(result)
			});
		} catch (error) {
			console.log("No se puede guardar el carrito -->", error)
		}
	},
	async updateToCart(object) {
		try {
			await AsyncStorage.setItem('SHOPPINGCART', JSON.stringify(object), () => {
				AsyncStorage.getItem('SHOPPINGCART', (err, result) => {
					console.log("Merge to cart", JSON.parse(result));
				});
			});
		} catch (error) {
			console.log("No se puede guardar el carrito")
		}
	},
	async addWishList(object) {
		try {
			await AsyncStorage.getItem('WISHLIST', (err, result) => {
				let indexProduct
				let response
				let flag = false
				result ? response = JSON.parse(result) : response = []
				if (response.length > 0) {
					for (let i = 0; i < response.length; i++) {
						if (response[i].cod_prod === object.cod_prod ) {	
							flag = true
							indexProduct = i
						}
					}
					if (!flag){
						response.push(object)
						AsyncStorage.setItem('WISHLIST', JSON.stringify(response), () => {
							showMessage({
								message: "Se agrego a tu lista de favoritos",
								type: "success"
							});
						});
						
					}else{
						response.splice(indexProduct, 1)
						AsyncStorage.setItem('WISHLIST', JSON.stringify(response), () => {
							showMessage({
								message: "Producto eliminado de tu lista de favoritos",
								type: "success"
							});
						});
						
					}
				} else {
					response.push(object)
					AsyncStorage.setItem('WISHLIST', JSON.stringify(response), () => {
						showMessage({
							message: "Se agrego a tu lista de favoritos",
							type: "success"
						});
					});
				}
				
			});
		} catch (error) {
			console.log("No se puede guardar en favoritos")
		}
	},
	async deleteProducts(){
		try {
			await AsyncStorage.removeItem('SHOPPINGCART')
		} catch (error) {
			console.log("No se puede eliminar los productos")
		}
	}
}


export default SHOPPINGCART