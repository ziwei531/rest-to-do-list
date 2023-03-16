import express from "express";

const router = express.Router();
import { Task } from "../Models/task.js";

//get all
router.get("/", async (req, res) => {
	try {
		const tasks = await Task.find();
		res.json(tasks);
	} catch (error) {
		//500 = database error
		res.status(500).json({ message: error.message });
	}
});

//get one
router.get("/:id", getTask, (req, res) => {
	res.send(res.task.task);
});

//create one
router.post("/", async (req, res) => {
	if (!req.body.task || req.body.task.trim() === "") {
		//send a 400 response with a message
		return res.status(400).json({ message: "Task value is required." });
	}
	const task = new Task({
		task: req.body.task,
	});

	try {
		const newTask = await task.save();
		res
			.status(201)
			.json({ message: "Task created successfully!", status: 201, newTask });
		//201 = created
	} catch (error) {
		res.status(400).json({ message: error.message }); //400 = bad request by user
	}
});

//delete one
router.delete("/:id", getTask, async (req, res) => {
	try {
		console.log(res.task);
		await Task.deleteOne({ _id: res.task._id }); //remove from database
		res.json({ message: "Task deleted successfully!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

//update one
router.patch("/:id", getTask, async (req, res) => {
	if (req.body.task != null) {
		res.task.task = req.body.task;
	}

	try {
		const updatedTask = await res.task.save();
		res.json(updatedTask);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

//middleware function
async function getTask(req, res, next) {
	let task;
	try {
		task = await Task.findById(req.params.id);
		if (task == null) {
			return res.status(404).json({ message: "Cannot find task" });
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}

	res.task = task;
	next(); //move on to the next function
}

export { router };
