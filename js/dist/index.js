"use strict";
// (noteCount - 13) * 920 + 4715
function PageLoad() {
    console.log(window.location.protocol);
    if (window.location.protocol != "http:") {
        window.location.protocol = "http:";
    }
    const urlParams = new URLSearchParams(window.location.search);
    const map = urlParams.get("map");
    var Value;
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
    if (Value)
        document.getElementById("select").classList.add("active");
    document.getElementById("title").innerText = Value.SpecificPacket.Parameters.Beatmap.Name;
    RquestScores(Value);
}
var bootstrap;
function RquestScores(Value) {
    var Overlay = new WebSocket("ws://ta.asodev.net:10157");
    Overlay.addEventListener("error", () => {
        ErrorModal("Failed to connect to TournamentAssistant", "We tried to connect to TournamentAssistant, but failed. This most likley means that the TA Server is down, please contact @Aso#0001 on discord.");
    });
    Overlay.addEventListener("open", () => {
        Overlay.send(JSON.stringify(Value));
    });
    Overlay.addEventListener("message", async (msg) => {
        var data = (await JSON.parse(msg.data));
        if (!data.SpecificPacket.Scores)
            return;
        var res = data.SpecificPacket;
        GenerateLeaderboard(res.Scores);
        Overlay.close();
    });
}
async function GenerateLeaderboard(Scores) {
    var Table = document.getElementById("table");
    var Template = document.getElementById("template");
    var MapData = (await (await fetch(`https://beatsaver.com/api/maps/by-hash/${Scores[0].Parameters.Beatmap.LevelId.replace("custom_level_", "")}`)).json());
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
function difficulty(x) {
    switch (x) {
        case 0:
            return "easy";
        case 1:
            return "normal";
        case 2:
            return "hard";
    }
}
function ErrorModal(title, description) {
    document.getElementById("err-title").innerText = title;
    document.getElementById("err-desc").innerText = description;
    var ErrorModal = new bootstrap.Modal(document.getElementById("ErrorModal"), {});
    ErrorModal.toggle();
}
window.onload = PageLoad;
