from flask import Flask, request, jsonify
import torch
from torchvision import models, transforms
from PIL import Image
import requests
import os

app = Flask(__name__)

MODEL_URL =  "http://192.168.56.103:8000/model"
MODEL_FILE = "mobilenet.pth"

if not os.path.exists(MODEL_FILE):
	r = requests.get(MODEL_URL)
	open(MODEL_FILE,"wb").write(r.content)

model = models.mobilenet_v2()
model.load_state_dict(torch.load(MODEL_FILE))
model.eval()

transform = transforms.Compose([
	transforms.Resize(256),
	transforms.CenterCrop(224),
	transforms.ToTensor(),
	transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
	])

labels = requests.get(
	"https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
).text.splitlines()

@app.route("/predict", methods=["POST"])
def predict():
	if "image" not in request.files:
		return jsonify({"error":"No image"}), 400

	file = request.files["image"]
	img = Image.open(file.stream).convert("RGB")

	t = transform(img).unsqueeze(0)

	with torch.no_grad():
		out = model(t)

	idx = out.argmax().item()

	return jsonify({
		"prediction":labels[idx]
	})

app.run(host="0.0.0.0", port=7000)
