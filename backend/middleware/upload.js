const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir ='uploads';
if (!fs.existsSync(uploadDir))
{
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req,file,cd)=> cd(null,'uploads/'),
    filename:(req,file,cd)=>{
        const uniqueName = Date.now()+ '-' + Math.round(Math.random() *1e9);
    cd(null, uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cd)=>{
    const allowed = /jpeg|jpg|png|webp/;
    if(allowed.test(path.extname(file.originalname).toLowerCase()))
    {
        cd(null,true);
    }else {
        cd(new Error('Only image files allowed'));
    }
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });