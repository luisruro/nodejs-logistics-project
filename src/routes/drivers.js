import { Router } from 'express';
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseArgs } from 'util';

const routerDrivers = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const driverFilePath = path.join(_dirname, "../../data/drivers.json");

// Read drivers file

const readDrivers = async () => {
    try {
        const driversData = await fs.readFile(driverFilePath, "utf8");
        return JSON.parse(driversData);
    } catch (error) {
        throw new Error (`Error en la promesa ${error.message}`);
    }
};

// Write drivers file

const writeDrivers = async (drivers) => {
    try {
        await fs.writeFile(driverFilePath, JSON.stringify(drivers, null, 2));
    } catch (error) {
        throw new Error (`Error en la promesa ${error.message}`);
    }
};

// Create new driver

routerDrivers.post("/", async (req, res) => {
    const drivers = await readDrivers();
    const newDriver = {
        id: drivers.length + 1,
        name: req.body.name
    };
    drivers.push(newDriver);
    await writeDrivers(drivers);
    res.status(201).json({message: 'Driver created successfully', driver: newDriver});
});

// Get all drivers

routerDrivers.get("/", async (req, res) => {
    const drivers = await readDrivers();
    res.json(drivers);
});

// Get driver by ID

routerDrivers.get("/:id", async (req, res) => {
    const drivers = await readDrivers();
    const driverById = drivers.find(driver => driver.id === parseInt(req.params.id));
    if (!driverById) {
        return res.status(404).json({message: 'Driver not found'});
    }
    res.json(driverById);
});

// Update driver by ID

routerDrivers.put("/:id", async (req, res) => {
    const drivers = await readDrivers();
    const driverId = drivers.findIndex(driver => driver.id === parseInt(req.params.id));
    if (driverId === -1) {
        return res.status(404).json({message: 'Driver not found'});
    }
    const updatedDriver = {
        ...drivers[driverId],
        name: req.body.name
    };
    drivers[driverId] = updatedDriver;
    await writeDrivers(drivers);
    res.json({message: 'Driver updated successfully', driver: updatedDriver});
});

// Delete driver by ID

routerDrivers.delete("/:id", async (req, res) => {
    const drivers = await readDrivers();
    //TRaigamelos todos excepto el que tenga el ID que se va a ingresar
    const newDrivers = drivers.filter(driver => driver.id !== parseInt(req.params.id));
    if (drivers.length === newDrivers.length) {
        return res.status(404).json({message: "Driver not found"});
    }
    await writeDrivers(newDrivers);
    res.json({message: "Driver deleted successfully"});
});

export default routerDrivers;
