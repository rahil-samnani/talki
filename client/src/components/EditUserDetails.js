import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetailsFixed = ({ onClose, user }) => {
    const [data, setData] = useState({
        name: user?.name || '',
        profile_pic: user?.profile_pic || ''
    });
    const [loading, setLoading] = useState(false);
    const uploadPhotoRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            ...user
        }));
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click();
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const uploadPhoto = await uploadFile(file);
            if (uploadPhoto?.url) {
                setData((prev) => ({
                    ...prev,
                    profile_pic: uploadPhoto.url
                }));
            }
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios.post(URL, data, { withCredentials: true });
            
            toast.success(response?.data?.message);
            
            if (response.data.success) {
                dispatch(setUser(response.data.data));
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm'>Edit user details</p>

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border-0.5'
                        />
                    </div>

                    <div>
                        <div>Photo:</div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar width={40} height={40} imageUrl={data?.profile_pic} name={data?.name} />
                            <label htmlFor='profile_pic'>
                                <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input
                                    type='file'
                                    id='profile_pic'
                                    className='hidden'
                                    onChange={handleUploadPhoto}
                                    ref={uploadPhotoRef}
                                />
                            </label>
                        </div>
                    </div>

                    <Divider />    
                    <div className='flex gap-2 w-fit ml-auto'>
                        <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                        <button type='submit' disabled={loading} className={`border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(EditUserDetailsFixed);