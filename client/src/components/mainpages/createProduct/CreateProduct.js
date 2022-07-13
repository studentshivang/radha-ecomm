import React, { useContext, useState , useEffect} from "react";
import axios from "axios";
import {GlobalState} from "../../../GlobalState";
import { toast } from "react-toastify";
import Loading from "../utils/loading/Loading"
import {useNavigate,useParams} from "react-router-dom"

const initialState = {
    product_id:"",
    title:'',
    price:0,
    description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia et, aperiam vel ipsa numquam voluptatem!',
    content:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci modi nobis quaerat id veritatis aperiam quo officia laborum error inventore, fugiat cum ipsa, libero possimus veniam ad minus nesciunt. Nam quis aliquid voluptate tempora impedit!',
    category:'',
    _id: ''
}

function CreateProduct() {
    const state = useContext(GlobalState);
    const [product,setProduct] = useState(initialState)
    const [categories] = state.categoriesAPI.categories;
    const [images,setImages] = useState(false)
    const [loading,setLoading] = useState(false)
    // const [callback,setCallBack] = state.userAPI.callback; 

    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;

    const navigate = useNavigate();
    const param = useParams();

    const [products] = state.productsAPI.products;
    const [onEdit,setOnEdit]  = useState(false)
    const [callback,setCallback]=state.productsAPI.callback;

    useEffect(()=>{
        if(param.id){
            setOnEdit(true)
            console.log(products);
            products.forEach(productItem=>{
                if(productItem._id===param.id){ 
                    console.log(productItem);
                    setProduct(productItem)
                    setImages(productItem.images)
                }
            })
        }else{
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)

        }
        // setCallBack(!callback)
    },[param.id,products])
    // console.log(param.id);
    // useEffect(()=>{
    //     alert(param.id);
    // },[])
    const handleUpload=async e =>{
        try {
            if(!isAdmin) return toast.error("You're not an admin!")
            const file = e.target.files[0]
            console.log(file);

            if(file===null) return toast.error("File does not exist.")

            if(file.size > 1024*1024) //1mb
                return toast.error("Size too large")

            if(file.type !=="image/jpeg" && file.type!=="image/png") 
                return toast.error("File format is incorrect!")

            let formData= new FormData()
            formData.append('file',file)
            
            setLoading(true)
            const res = await axios.post('/api/upload',formData,{
                headers:{'content-type':'multipart/form-data',Authorization:token}
            })
            setLoading(false)
            setImages(res.data);


        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    const handleDestroy = async ()=>{
        try {
            if(!isAdmin) return toast.error("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy',{public_id:images.public_id},{
                headers:{Authorization:token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    const handleChangeInput = (e)=>{
        const {name,value} = e.target;
        setProduct({...product,[name]:value})
    }

    const handleSubmit=async e=>{
        e.preventDefault()
        try {
            if(!isAdmin) return toast.error(`You're not an admin!`)
            if(!images) return toast.error(`No image uploaded!`)

            if(onEdit){
                await axios.put(`/api/products/${product._id}`,{...product,images},{
                    headers:{Authorization:token}
                })
            }else{
                await axios.post('/api/products',{...product,images},{
                    headers:{Authorization:token}
                })
            }
            setCallback(!callback);
            navigate('/');
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    } 

    const styleUpload = {
        display:images?"block":"none"
    }
    
    return(
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading?<div id="file_img"><Loading/></div>
                    :<div id="file_img" style={styleUpload}>
                    <img src={images?images.url:''} alt="" />
                    <span onClick={handleDestroy}>X</span>
                </div>}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">Product ID</label>
                    <input type="text" name="product_id" id="product_id" required
                    value={product.product_id} onChange={handleChangeInput} disabled={onEdit}/>
                </div>
                

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleChangeInput}/>
                </div>
                
                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" required
                    value={product.price} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={product.description} rows="5" onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content" required
                    value={product.content} rows="7" onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="categories">Categories: </label>
                    <select name="category" value={product.category} onChange={handleChangeInput}>
                        <option value="">Please select a category</option>
                        {
                            categories.map(category=>(
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <button type="submit">{onEdit?"Update":"Create"}</button>
            </form>
        </div>
    )
}

export default CreateProduct;