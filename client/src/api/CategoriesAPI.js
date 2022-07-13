import React, { useEffect, useState } from "react";
import axios from "axios";

function CategoriesAPI(){
    const [categories,setCategories] = useState([])
    const [callback,setCallBack] = useState(false);


    useEffect(()=>{
        const getCategories= async ()=>{
            const res = await axios.get('/api/category');
            setCategories(res.data); 
        }
        getCategories()
    },[callback])

    return{
        categories:[categories,setCategories],
        callback:[callback,setCallBack]
    }

}

export default CategoriesAPI