import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const routerWarehouses = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const warehousesFilePath = path.join(_dirname, "../../data/warehouses.json");

//Read warehouses file

const readWarehouses = async () => {
    try {
        const warehousesData = await fs.readFile(warehousesFilePath);
        return JSON.parse(warehousesData);
    } catch (error) {
        throw new Error(`Error en la promesa ${error.message}`);
    }
};

// Write warehouses file

const writeWarehouses = async (warehouses) => {
    try {
        await fs.writeFile(warehousesFilePath, JSON.stringify(warehouses, null, 2));
    } catch (error) {
        throw new Error(`Error en la promesa ${error.message}`);
    }
};

// Create new warehouse

routerWarehouses.post("/", async (req, res) => {
    const warehouses = await readWarehouses();
    const newWarehouse = {
        id: warehouses.length + 1,
        name: req.body.name,
        location: req.body.location
    };
    warehouses.push(newWarehouse);
    await writeWarehouses(warehouses);
    res.status(201).json({ message: "Warehouse created successfully", Warehouse: newWarehouse });
});

// Get all warehouses

routerWarehouses.get("/", async (req, res) => {
    const warehouses = await readWarehouses();
    res.json(warehouses);
});

// Get warehouse by ID

routerWarehouses.get("/:id", async (req, res) => {
    const warehouses = await readWarehouses();
    const warehouseById = warehouses.find(warehouse => warehouse.id === parseInt(req.params.id));
    if (!warehouseById) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json(warehouseById);
});

// Update warehouse by ID

routerWarehouses.put("/:id", async (req, res) => {
    const warehouses = await readWarehouses();
    const warehouseId = warehouses.findIndex(warehouse => warehouse.id === parseInt(req.params.id));
    if (warehouseId === -1) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    const updateWarehouse = {
        ...warehouses[warehouseId],
        name: req.body.name,
        location: req.body.location
    };
    warehouses[warehouseId] = updateWarehouse;
    await writeWarehouses(warehouses);
    res.json({ message: "Warehouse updated successfully", warehouse: updateWarehouse });
});

// Delete warehouse by ID

routerWarehouses.delete("/:id", async (req, res) => {
    const warehouses = await readWarehouses();
    const newWarehouses = warehouses.filter(warehouse => warehouse.id !== parseInt(req.params.id));
    if (warehouses.length === newWarehouses.length) {
        return res.status(404).json({ message: "Warehouse not found" });
    }
    await writeWarehouses(newWarehouses);
    res.json({ message: "Warehouse deleted successfully" });
});

export default routerWarehouses;