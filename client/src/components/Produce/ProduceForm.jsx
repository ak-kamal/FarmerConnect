import React, { useState } from 'react';
import axios from 'axios'; 

const ProduceForm = () => {
    const [formData, setFormData] = useState({
        produceName: '',
        category: '',
        quantity: '',
        region: '', 
        pricePerUnit: '',
        qualityGrade: '',
        description: '',
        harvestDate: '',
    });
    
    const [fileData, setFileData] = useState(null); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFileData(e.target.files[0]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const dataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key]);
        });

        if (fileData) {
            dataToSend.append('image', fileData);
        }
        
        const token = localStorage.getItem('farmerConnectToken'); 
        
        try {
            const response = await axios.post(
                '/api/produce', 
                dataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                }
            );

            setSuccess('Produce details uploaded successfully!');
            setFormData({ produceName: '', category: '', quantity: '', region: '', pricePerUnit: '', qualityGrade: '', description: '', harvestDate: '' });
            setFileData(null); 
            document.getElementById('image-input').value = null; 

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload produce. Check console for details.');
            console.error('Upload Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="produce-form-container">
            <h2>Upload New Produce Details (FR-5)</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                {/* 1. Produce Name */}
                <label>Produce Name: <input type="text" name="produceName" value={formData.produceName} onChange={handleChange} required /></label>
                
                {/* 2. Category */}
                <label>Category: <input type="text" name="category" value={formData.category} onChange={handleChange} required /></label>
                
                {/* 3. Quantity */}
                <label>Quantity (kg): <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required /></label>
                
                {/* 4. Region */}
                <label>Region: <input type="text" name="region" value={formData.region} onChange={handleChange} required /></label>
                
                {/* 5. Price Per Unit */}
                <label>Price Per Kg (Taka): <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} step="0.01" min="0" required /></label>
                
                {/* 6. Quality Grade */}
                <label>Quality Grade: <select name="qualityGrade" value={formData.qualityGrade} onChange={handleChange} required>
                    <option value="">Select Grade</option>
                    <option value="A">A</option><option value="B">B</option><option value="C">C</option>
                </select></label>
                
                {/* 7. Description */}
                <label>Description: <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required /></label>

                {/* 8. Harvest Date */}
                <label>Harvest Date: <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} required /></label>

                {/* 9. Image Input */}
                <label>
                    Produce Image:
                    <input
                        type="file"
                        id="image-input" 
                        name="image" 
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Produce Details'}
                </button>
            </form>
        </div>
    );
};

export default ProduceForm;