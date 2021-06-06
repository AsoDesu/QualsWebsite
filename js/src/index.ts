// (noteCount - 13) * 920 + 4715

var Overlay = new WebSocket("ws://127.0.0.1:10157");
var error = false;

function PageLoad() {
	if (window.location.protocol != "http:") {
		window.location.protocol = "http:";
	}

	Overlay.addEventListener("error", () => {
		var ErrorModal = new bootstrap.Modal(document.getElementById("ErrorModal"), {});
		ErrorModal.toggle();
	});

	const urlParams = new URLSearchParams(window.location.search);
	const map = urlParams.get("map");

	var Value: ScoreRequestPacket;

	switch (map) {
		case "1":
			Value = Kakurenbocchi;
			break;
		case "2":
			Value = LostIt;
			break;
		case "3":
			Value = GateOne;
			break;
		case "4":
			Value = NobodyToLove;
			break;
		case "5":
			Value = Kakumei;
			break;
		case "6":
			Value = PokemonCapture;
			break;
		case "all":
			return;
		case null:
			window.location.href = "?map=1";
			return;
		default:
			document.getElementById("loading").innerHTML = "";
			document.getElementById("title").innerText = "Map Not Found.";
			return;
	}

	if (Value) document.getElementById("select").classList.add("active");

	document.getElementById("title").innerText = Value.SpecificPacket.Parameters.Beatmap.Name;

	RequestScores(Value, (Scores: Score[]) => {
		GenerateLeaderboard(Scores);
	});
}

var bootstrap: any;

function RequestScores(Value: ScoreRequestPacket, cb: any) {
	if (Overlay.readyState != Overlay.OPEN) {
		Overlay.addEventListener("open", () => {
			Overlay.send(JSON.stringify(Value));
		});
	} else {
		Overlay.send(JSON.stringify(Value));
	}

	Overlay.addEventListener("message", async (msg) => {
		var data = (await JSON.parse(msg.data)) as Packet;
		if (!data.SpecificPacket.Scores) return;

		var res = data.SpecificPacket as ScoreResponsePacket;
		console.log(res.Scores[0].Parameters.Beatmap.Name);
		cb(res.Scores);
	});
}

async function GenerateLeaderboard(Scores: Score[]) {
	var Table = document.getElementById("table");
	var Template = document.getElementById("template");
	var MapData = (await (await fetch(`https://beatsaver.com/api/maps/by-hash/${Scores[0].Parameters.Beatmap.LevelId.replace("custom_level_", "")}`)).json()) as BSMap;

	var notes = MapData.metadata.characteristics.find((c) => c.name == "Standard").difficulties[difficulty(Scores[0].Parameters.Beatmap.Difficulty)].notes;
	var maxscore = (notes - 13) * 920 + 4715;

	Table.removeChild(Template);

	var template = Template.innerHTML;
	var html = "";

	Scores.forEach((score) => {
		console.log(score.Username);
		html = template
			.replace("%acc%", ((score._Score / maxscore) * 100).toPrecision(3).toString() + "%")
			.replace("%place%", (Scores.indexOf(score) + 1).toString())
			.replace("%name%", score.Username)
			.replace("%score%", score._Score.toString());

		Table.insertAdjacentHTML("beforeend", html);
	});

	document.getElementById("loading").innerHTML = "";
	document.getElementById("table-container").classList.remove("hidden");
}

function difficulty(x: number) {
	switch (x) {
		case 0:
			return "easy";
		case 1:
			return "normal";
		case 2:
			return "hard";
	}
}

window.onload = PageLoad;
