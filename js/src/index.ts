// (noteCount - 13) * 920 + 4715

function PageLoad() {
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

	RquestScores(Value);
}

var bootstrap: any;

function RquestScores(Value: ScoreRequestPacket) {
	var Overlay = new WebSocket("ws://ta.asodev.net:10157");

	Overlay.addEventListener("error", () => {
		var ErrorModal = new bootstrap.Modal(document.getElementById("ErrorModal"), {});
		ErrorModal.toggle();
	});

	Overlay.addEventListener("open", () => {
		Overlay.send(JSON.stringify(Value));
	});

	Overlay.addEventListener("message", async (msg) => {
		var data = (await JSON.parse(msg.data)) as Packet;
		if (!data.SpecificPacket.Scores) return;

		var res = data.SpecificPacket as ScoreResponsePacket;
		GenerateLeaderboard(res.Scores);
		Overlay.close();
	});
}

function GenerateLeaderboard(Scores: Score[]) {
	var Table = document.getElementById("table");
	var Template = document.getElementById("template");

	Table.removeChild(Template);

	var template = Template.innerHTML;
	var html = "";

	Scores.forEach((score) => {
		console.log(score.Username);
		html = template
			.replace("%place%", (Scores.indexOf(score) + 1).toString())
			.replace("%name%", score.Username)
			.replace("%score%", score._Score.toString());

		Table.insertAdjacentHTML("beforeend", html);
	});

	document.getElementById("loading").innerHTML = "";
	document.getElementById("table-container").classList.remove("hidden");
}

window.onload = PageLoad;
