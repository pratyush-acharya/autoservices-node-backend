import cors from "cors";

const allowedOrigin = process.env.NODE_ENV === "production" ? process.env.CLIENT_HOST : '*'
export const corsSetup = cors({
    origin: allowedOrigin,
    methods: 'GET,PUT,PATCH,POST,DELETE'
})