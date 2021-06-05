interface ReqParams {
	Beatmap: {
		Name: string;
		LevelId: string;
		Characteristic: {
			SerializedName: string;
			Difficulties: number[];
		};
		Difficulty: number;
	};
	PlayerSettings: {
		PlayerHeight: number;
		SfxVolume: number;
		SaberTrailIntensity: number;
		NoteJumpStartBeatOffset: number;
		Options: number;
	};
	GameplayModifiers: {
		Options: number;
	};
}

interface Score {
	EventId: string;
	Parameters: ReqParams;
	UserId: number;
	Username: string;
	_Score: number;
	FullCombo: boolean;
	Color: string;
}

interface Packet {
	Size: number;
	SpecificPacketSize: number;
	Id: string;
	From: string;
	Type: number;
	SpecificPacket: any;
}

interface ScoreRequestPacket extends Packet {
	SpecificPacket: {
		EventId: string;
		Parameters: ReqParams;
	};
}

interface ScoreResponsePacket {
	Scores: Score[];
}
