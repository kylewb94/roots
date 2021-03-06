import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import Meta from '../components/Meta'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
	const productId = match.params.id

	const [name, setName] = useState('')
	const [image, setImage] = useState('')
	const [description, setDescription] = useState('')
	const [type, setType] = useState('')
	const [flower, setFlower] = useState('')
	const [price, setPrice] = useState(0)
	const [countInStock, setCountInStock] = useState(0)
	const [uploading, setUploading] = useState(false)

	const dispatch = useDispatch()

	const productDetails = useSelector((state) => state.productDetails)
	const { loading, error, product } = productDetails

	const productUpdate = useSelector((state) => state.productUpdate)
	const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

	useEffect(() => {
		if(successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET })
			history.push('/admin/productlist')
		} else {
			if(!product.name || product._id !== productId) {
				dispatch(listProductDetails(productId))
			} else {
				setName(product.name)
				setImage(product.image)
				setDescription(product.description)
				setType(product.type)
				setFlower(product.flower)
				setPrice(product.price)
				setCountInStock(product.countInStock)
			}
		}
	}, [dispatch, history, productId, product, successUpdate])

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0]
		const formData = new FormData()
		formData.append('image', file)
		setUploading(true)

		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
			}

			const { data } = await axios.post('/api/upload', formData, config)

			setImage(data)
			setUploading(false)
		} catch (error) {
			console.error(error)
			setUploading(false)
		}
	}

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(updateProduct({ _id: productId, name, image, description, type, flower, price, countInStock }))
	}
	
	return (
		<>
			<Meta title='Edit Product | Roots' />
			<Link to='/admin/productlist' className='btn btn-outline-dark my-3'>
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product</h1>
				{loadingUpdate && <Loader/>}
				{errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
				{loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='image'>
							<Form.Label>Image</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter image URL'
								value={image}
								onChange={(e) => setImage(e.target.value)}
							></Form.Control>
							<Form.File id='image-file' label='Choose File' custom onChange={uploadFileHandler}></Form.File>
							{uploading && <Loader />}
						</Form.Group>

						<Form.Group controlId='description'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								as='textarea'
								rows='5'
								type='text'
								placeholder='Enter description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='type'>
							<Form.Label>Type</Form.Label>
							<Form.Control
								as='select'
								type='text'
								placeholder='Enter type'
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<option>Annual</option>
								<option>Bulb</option>
								<option>Fruit</option>
								<option>Herb</option>
								<option>Houseplant</option>
								<option>Perennial</option>
								<option>Rose</option>
								<option>Shrub</option>
								<option>Tree</option>
								<option>Vegetable</option>
								<option>Vine</option>
								<option>Water Plant</option>
							</Form.Control>
						</Form.Group>

						<Form.Group controlId='flower'>
							<Form.Label>Flower</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter flower'
								value={flower}
								onChange={(e) => setFlower(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter price'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='countInStock'>
							<Form.Label>Count In Stock</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter count in stock'
								value={countInStock}
								onChange={(e) => setCountInStock(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Button type='submit' variant='dark'>Update</Button>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default ProductEditScreen