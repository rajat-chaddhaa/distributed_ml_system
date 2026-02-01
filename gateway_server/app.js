const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const app = express();
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
	destination: "uploads/",
	filename: (req, file, cb) => {
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const upload = multer({storage});

app.get("/", (req, res)=>{
	res.send(`
	<!DOCTYPE html>
	<html>
	<head>
	<title>Image Classifier</title>

	<style>
		body {
			font-family: Arial;
			text-align: center;
			margin-top: 50px
		}

		img {
			margin-top: 20px;
			max-width: 300px;
		}

		button {
			padding: 10px 20px;
			font-size: 16px;
			background: #4CAF50;
			color: white;
			border: none;
			cursor: pointer;
		}

	</style>
	</head>

	<body>


	<h2>Image Classification System</h2>

	<form id = "uploadForm" enctype="multipart/form-data">

		<input type="file" name="image" multiple required>
		<br><br>

		<button type="submit">Classify</button>

	</form>

	<div id = "result"></div>

	<script>

	document.getElementById("uploadForm").addEventListener("submit", async function(e){

		e.preventDefault();

		const formData = new FormData(this);

		const res = await fetch("/classify", {
			method: "POST",
			body: formData
		});

		const data = await res.json();

		let html = "";

		data.forEach(item => {

			html += \`
				<h3>Prediction: \${item.prediction}</h3>
				<img src="\${item.imageUrl}">
				<hr>
			\`;
		});

		document.getElementById("result").innerHTML = html;

	});

	</script>

	</body>
	</html>
	`);
	});

app.post("/classify", upload.array("image", 5), async (req, res) => {
	try {

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: "No images uploaded"});
		}

		const result = [];

		for (const file of req.files) {
			const form = new FormData();

			form.append("image", fs.createReadStream(file.path));

			const r = await axios.post(
				"http://192.168.56.104:7000/predict",
				form,
				{
					headers: form.getHeaders(),
					maxBodyLength: Infinity
				}
			);

			result.push({
				prediction: r.data.prediction,
				imageUrl: `/uploads/${file.filename}`
			});
		}
		res.json(result);

	} catch(err){

		console.error("Gateway Error:", err.message);

		if (err.response) {
			console.error("ML RESPONSE:", err.response.data);
		}

		res.status(500).json({
			error: "ML Server Error"
		});
	}
});

app.listen(3000, ()=>{
	console.log("Gateway Server running on post 3000");
});
