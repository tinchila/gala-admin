import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import { useState } from 'react';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: "women",
        new_price: "",
        old_price: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    }

    const Add_Product = async () => {
        try {
            if (!image) {
                alert('Please select an image');
                return;
            }

            let formData = new FormData();
            formData.append('product', image);

            // Subir la imagen primero
            const uploadResponse = await fetch('https://gala-backend-nf24.onrender.com/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Error al cargar la imagen');
            }

            const responseData = await uploadResponse.json();

            if (responseData.success) {
                const { image_url } = responseData;

                // Agregar el producto con la URL de la imagen
                const product = {
                    ...productDetails,
                    image: image_url,
                };

                const addProductResponse = await fetch('https://gala-backend-nf24.onrender.com/addproduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });

                if (!addProductResponse.ok) {
                    throw new Error('Error al agregar el producto');
                }

                const addProductData = await addProductResponse.json();

                if (addProductData.success) {
                    alert("Producto agregado correctamente");
                    // Reiniciar el estado del formulario después de agregar el producto
                    setProductDetails({
                        name: "",
                        category: "women",
                        new_price: "",
                        old_price: ""
                    });
                    setImage(null);
                } else {
                    alert("Error al agregar el producto");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
        }
    }

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Título del Producto</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Escribe aquí' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Precio</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Escribe aquí' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Precio de Oferta</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Escribe aquí' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Categoría del Producto</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="women">Mujer</option>
                    <option value="men">Hombre</option>
                    <option value="kid">Niños</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='addproduct-thumbnail-img' />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>AGREGAR</button>
        </div>
    )
}

export default AddProduct;
