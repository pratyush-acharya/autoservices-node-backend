import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

export async function connectToAtlas() {
    await mongoose.connect(process.env.DB_URL).then(() => {
        console.log('Database connected successfully');
    }).catch((err)=>{
        throw err;
    });
}