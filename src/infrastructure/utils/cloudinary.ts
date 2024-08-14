import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'dcmxq5g2u', 
  api_key: '812396539973624', 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export default cloudinary