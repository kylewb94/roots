import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import {
	listProducts,
	deleteProduct,
	createProduct
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1
	
	const dispatch = useDispatch()
	
	const productList = useSelector(state => state.productList)
	const { loading, error, products, page, pages } = productList

	const productDelete = useSelector(state => state.productDelete)
	const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

	const productCreate = useSelector(state => state.productCreate)
	const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate

	const userLogin = useSelector(state => state.userLogin)
	const { userInfo } = userLogin
	
	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET })

		if(!userInfo.isAdmin) {
			history.push('/login')
		}
		
		if(successCreate) {
			history.push(`/admin/product/${createdProduct._id}/edit`)
		} else {
			dispatch(listProducts('', pageNumber))
		}
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdProduct,
		pageNumber
	])

	const deleteHandler = (id) => {
		if(window.confirm('Are you sure?')) {
			dispatch(deleteProduct(id))
		}
	}

	const createProductHandler = () => {
		dispatch(createProduct())
	}

	return (
		<>
			<Meta title='Products | Roots' />
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-right'>
					<Button className='btn-dark my-3' onClick={createProductHandler}>
						<i className='fas fa-plus'></i> Create Product
					</Button>
				</Col>
			</Row>
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}
			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}
			{loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>TYPE</th>
								<th>FLOWER</th>
								<th className='text-center'>EDIT</th>
								<th className='text-center'>DELETE</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>{product.price}</td>
									<td>{product.type}</td>
									<td>{product.flower}</td>
									<td className='text-center'>
										<LinkContainer to={`/admin/product/${product._id}/edit`}>
											<Button className='btn-sm' variant='outline-dark'>
												<i className='fas fa-edit'></i>
											</Button>
										</LinkContainer>
									</td>
									<td className='text-center'>	
										<Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Paginate page={page} pages={pages} isAdmin={true} />
				</>	
			)}
		</>
	)
}

export default ProductListScreen