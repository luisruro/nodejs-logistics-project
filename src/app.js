import express from "express";
import routerWarehouses from "./routes/warehouses.js";
import routerShipments from "./routes/shipments.js";
import routerDrivers from "./routes/drivers.js";
// import routerVehicles from "./routes/vehicles.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/warehouses", routerWarehouses);
app.use("/shipments", routerShipments);
app.use("/drivers", routerDrivers);
// app.use("/vehicles", routerVehicles);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});