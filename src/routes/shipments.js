import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const routerShipments = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const shipmentsFilePath = path.join(_dirname, "../../data/shipments.json");

//Read warehouses file

const readShipments = async () => {
    try {
        const shipmentsData = await fs.readFile(shipmentsFilePath);
        return JSON.parse(shipmentsData);
    } catch (error) {
        throw new Error(`Error en la promesa ${error.message}`);
    }
};

// Write warehouses file

const writeShipments = async (shipments) => {
    try {
        await fs.writeFile(shipmentsFilePath, JSON.stringify(shipments, null, 2));
    } catch (error) {
        throw new Error(`Error en la promesa ${error.message}`);
    }
};

// Create new warehouse

routerShipments.post("/", async (req, res) => {
    const warehousesUrl = await fetch(`http://localhost:3000/warehouses/${req.body.warehouseId}`);
    const shipments = await readShipments();
    const newShipment = {
        id: shipments.length + 1,
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: await warehousesUrl.json()
    };
    shipments.push(newShipment);
    await writeShipments(shipments);
    res.status(201).json({ message: "Warehouse created successfully", Warehouse: newShipment });
});

// Get all warehouses

routerShipments.get("/", async (req, res) => {
    const shipments = await readShipments();
    res.json(shipments);
});

// Get warehouse by ID

routerShipments.get("/:id", async (req, res) => {
    const shipments = await readShipments();
    const shipmentById = shipments.find(shipment => shipment.id === parseInt(req.params.id));
    if (!shipmentById) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.json(shipmentById);
});

// Update warehouse by ID

routerShipments.put("/:id", async (req, res) => {
    const warehousesUrl = await fetch(`http://localhost:3000/warehouses/${req.body.warehouseId}`);
    const shipments = await readShipments();
    const shipmentId = shipments.findIndex(shipment => shipment.id === parseInt(req.params.id));
    if (shipmentId === -1) {
        return res.status(404).json({ message: 'Warehouse not found' });
    }
    const updateshipment = {
        ...shipments[shipmentId],
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: await warehousesUrl.json()
    };
    shipments[shipmentId] = updateshipment;
    await writeShipments(shipments);
    res.json({ message: "Warehouse updated successfully", warehouse: updateshipment});
});

// Delete warehouse by ID

routerShipments.delete("/:id", async (req, res) => {
    const shipments = await readShipments();
    const newShipments = shipments.filter(shipment => shipment.id !== parseInt(req.params.id));
    if (shipments.length === newShipments.length) {
        return res.status(404).json({ message: "Warehouse not found" });
    }
    await writeShipments(newShipments);
    res.json({ message: "Warehouse deleted successfully" });
});

export default routerShipments;