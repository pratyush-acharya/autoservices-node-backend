import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import ExpressFileupload from "express-fileupload";
import { corsSetup } from "./app/v1/config/corsConfig.js";
import { connectToAtlas } from "./app/v1/config/database.js";
import { verifyJWT } from "./app/v1/middlewares/verifyJWT.js";

import { router as userRoutes } from "./app/v1/routes/UserRoutes.js";
import { router as authRoutes } from "./app/v1/routes/AuthRoutes.js";
import { router as logoutRouter } from "./app/v1/routes/LogoutRoute.js";
import { router as vehicleRoutes } from "./app/v1/routes/VehicleRoutes.js";
import { router as downloadRouter } from "./app/v1/routes/DownloadRoute.js";
import { router as categoryRouter } from "./app/v1/routes/CategoryRoute.js";
import { router as solutionRoutes } from "./app/v1/routes/SolutionRoute.js";
import { router as employeeRoutes } from "./app/v1/routes/EmployeeRoute.js";
import { router as dashboardRouter } from "./app/v1/routes/AdminDashboardRoute.js";
import { router as organizationRouter } from "./app/v1/routes/OrganizationRoute.js";
import { router as serviceRequestRouter } from "./app/v1/routes/ServiceRequestRoute.js";
import { router as forgotPasswordRouter } from "./app/v1/routes/ForgotPasswordRoute.js";
import { router as reportRouter } from "./app/v1/routes/ReportRoute.js";

export const app = express();

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
global.appRoot = path.dirname(__filename);

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(appRoot, "storage")));
app.use(ExpressFileupload());

dotenv.config({
  path: ".env",
});

app.use(corsSetup);
connectToAtlas().then((err) => {
  if (err) console.log("Connection Failed");
  console.log("Database Ready for Query ....");
});

app.use("/api/v1/report", reportRouter);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/forgot-password", forgotPasswordRouter);
app.use("/storage", express.static(path.join(appRoot, "storage")));
app.use("/api/v1/download", downloadRouter);
app.use(verifyJWT);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/logout", logoutRouter);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/solutions", solutionRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/service-request", serviceRequestRouter);

app.listen(PORT, () => {
  console.log(`Server Running on PORT: http://127.0.0.1:${PORT}`);
});
