import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config'

const app = express();

app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(express.json());


//Routes
import userRoutes from './routes/user.js';
import addressRoutes from './routes/address.js';
import reviewRoutes from './routes/review.js';
import cartRoutes from './routes/cart.js';
import categoryRoutes from './routes/category.js';
import bannerRoutes from './routes/banner.js';
import brandRoutes from './routes/brand.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import adhaarRoutes from './routes/adhaar.js';

app.use("/api/user",userRoutes);
app.use("/api/user/address",addressRoutes);
app.use("/api/user/review",reviewRoutes);
app.use("/api/user/cart",cartRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/banner",bannerRoutes);
app.use("/api/brand",brandRoutes);
app.use("/api/product",productRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/adhaar",adhaarRoutes);


//Database
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Database Connection is ready...');
        //Server
        app.listen(process.env.PORT, () => {
            console.log(`server is running http://localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })