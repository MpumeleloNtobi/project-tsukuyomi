'use client'
import React, { useState } from 'react';

function Addnewproduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const [nameError, setNameError] = useState('');
  const [descError, setDescError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    let valid = true;
    if (productName.trim() === '') {
      setNameError('Please enter the name of the product');
      valid = false;
    }
    if (description.trim() === '') {
      setDescError('Please enter a description');
      valid = false;
    }
    if (price === '' || Number(price) <= 0) {
      setPriceError('Enter a valid price greater than 0');
      valid = false;
    }
    if (category === '') {
      setCategoryError('Please select a category');
      valid = false;
    }
    if (!valid) return;

    //build JSON
    const productData = {
      name: productName,
      description,
      price: parseFloat(price),
      category,
    };
    //build the request to send the JSON










    //reset everyfield to empty
    setProductName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setNameError('');
    setDescError('');
    setPriceError('');
    setCategoryError('');
    alert('Product added successfully!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label><br />
          <input type="text" value={productName}
            onChange={(e) => {
              const name = e.target.value;
              if (name.trim() === '') {
                setNameError('Please enter the name of the product');
              } else {
                setNameError('');
              }
              setProductName(name);
            }}
          />
          {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
        </div>
        <div>
          <label>Description:</label><br />
          <textarea value={description}
            onChange={(e) => {
              const desc = e.target.value;
              if (desc.trim() === '') {
                setDescError('Please enter a description');
              } else {
                setDescError('');
              }
              setDescription(desc);
            }}
          />
          {descError && <div style={{ color: 'red' }}>{descError}</div>}
        </div>
        <div>
          <label>Price:</label><br />
          <input type="number"value={price}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || Number(val) <= 0) {
                setPriceError('Enter a valid price greater than 0');
              } else {
                setPriceError('');
              }
              setPrice(val);
            }}
          />
          {priceError && <div style={{ color: 'red' }}>{priceError}</div>}
        </div>
        <div>
          <label>Category:</label><br />
          <select value={category}
            onChange={(e) => {
              const categ = e.target.value;
              if (categ === '') {
                setCategoryError('Please select a category');
              } else {
                setCategoryError('');
              }
              setCategory(categ);
            }}
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Kitchen</option>
          </select>
          {categoryError && <div style={{ color: 'red' }}>{categoryError}</div>}
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>Add Product</button>
      </form>
    </div>
  );
}

export default Addnewproduct;
