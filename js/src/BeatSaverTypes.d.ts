interface BSMap {
	metadata: Metadata;
	stats: Stats;
	description: string;
	deletedAt?: null;
	_id: string;
	key: string;
	name: string;
	uploader: Uploader;
	hash: string;
	uploaded: string;
	directDownload: string;
	downloadURL: string;
	coverURL: string;
}
interface Metadata {
	difficulties: Difficulties;
	duration: number;
	automapper?: null;
	characteristics?: CharacteristicsEntity[] | null;
	levelAuthorName: string;
	songAuthorName: string;
	songName: string;
	songSubName: string;
	bpm: number;
}
interface Difficulties {
	easy: boolean;
	expert: boolean;
	expertPlus: boolean;
	hard: boolean;
	normal: boolean;
}
interface CharacteristicsEntity {
	difficulties: Difficulties1;
	name: string;
}
interface Difficulties1 {
	easy: EasyOrExpertOrExpertPlusOrHardOrNormal;
	expert: EasyOrExpertOrExpertPlusOrHardOrNormal;
	expertPlus: EasyOrExpertOrExpertPlusOrHardOrNormal;
	hard: EasyOrExpertOrExpertPlusOrHardOrNormal;
	normal: EasyOrExpertOrExpertPlusOrHardOrNormal;
}
interface EasyOrExpertOrExpertPlusOrHardOrNormal {
	duration: number;
	length: number;
	njs: number;
	njsOffset: number;
	bombs: number;
	notes: number;
	obstacles: number;
}
interface Stats {
	downloads: number;
	plays: number;
	downVotes: number;
	upVotes: number;
	heat: number;
	rating: number;
}
interface Uploader {
	_id: string;
	username: string;
}
