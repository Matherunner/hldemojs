import ViewWrapper from './viewwrapper';

class ParseException {
	constructor(message) {
		this.message = message;
	}
}

const HEADER_MAPNAME_SIZE = 260;
const HEADER_GAMEDIRECTORY_SIZE = 260;

const DIRECTORY_ENTRY_COUNT_MIN = 1;
const DIRECTORY_ENTRY_COUNT_MAX = 1024;
const DIRECTORY_ENTRY_DESCRIPTION_SIZE = 64;

const FRAME_CONSOLE_COMMAND_SIZE = 64;
const FRAME_SKYNAME_SIZE = 32;
const FRAME_TYPE_MIN = 2;
const FRAME_TYPE_MAX = 9;

// These functions return true if the parsing is meant to continue, false if otherwise.
const FRAME_READERS = [
	() => false,
	() => false,

	// Index 2: DEMO_START
	() => true,

	// Index 3: CONSOLE_COMMAND
	(viewer, frame) => {
		frame.command = viewer.readString(FRAME_CONSOLE_COMMAND_SIZE);
		return true;
	},

	// Index 4: CLIENT_DATA
	(viewer, frame) => {
		frame.origin = viewer.readFloat32Array(3);
		frame.viewangles = viewer.readFloat32Array(3);
		frame.weaponBits = viewer.readInt32();
		frame.fov = viewer.readFloat32();
		return true;
	},

	// Index 5: NEXT_SECTION
	() => false,

	// Index 6: EVENT
	(viewer, frame) => {
		frame.flags = viewer.readInt32();
		frame.index = viewer.readInt32();
		frame.delay = viewer.readFloat32();
		frame.eventArgs = {
			flags: viewer.readInt32(),
			entityIndex: viewer.readInt32(),
			origin: viewer.readFloat32Array(3),
			angles: viewer.readFloat32Array(3),
			velocity: viewer.readFloat32Array(3),
			ducking: viewer.readInt32(),
			fparam1: viewer.readFloat32(),
			fparam2: viewer.readFloat32(),
			iparam1: viewer.readInt32(),
			iparam2: viewer.readInt32(),
			bparam1: viewer.readInt32(),
			bparam2: viewer.readInt32(),
		};
		return true;
	},

	// Index 7: WEAPON_ANIMATION
	(viewer, frame) => {
		frame.anim = viewer.readInt32();
		frame.body = viewer.readInt32();
		return true;
	},

	// Index 8: SOUND
	(viewer, frame) => {
		frame.channel = viewer.readInt32();
		const length = viewer.readInt32();
		frame.samples = viewer.readUint8Array(length);
		frame.attenuation = viewer.readFloat32();
		frame.volume = viewer.readFloat32();
		frame.flags = viewer.readInt32();
		frame.pitch = viewer.readInt32();
		return true;
	},

	// Index 9: DEMO_BUFFER
	(viewer, frame) => {
		const length = viewer.readInt32();
		frame.buffer = viewer.readUint8Array(length);
		return true;
	},
];

function readNetMessageFrame(viewer, frame) {
	frame.demoInfo = {
		timestamp: viewer.readFloat32(),

		refParams: {
			vieworg: viewer.readFloat32Array(3),
			viewangles: viewer.readFloat32Array(3),
			forward: viewer.readFloat32Array(3),
			right: viewer.readFloat32Array(3),
			up: viewer.readFloat32Array(3),
			frametime: viewer.readFloat32(),
			time: viewer.readFloat32(),
			intermission: viewer.readInt32(),
			paused: viewer.readInt32(),
			spectator: viewer.readInt32(),
			onground: viewer.readInt32(),
			waterlevel: viewer.readInt32(),
			simvel: viewer.readFloat32Array(3),
			simorg: viewer.readFloat32Array(3),
			viewheight: viewer.readFloat32Array(3),
			idealpitch: viewer.readFloat32(),
			cl_viewangles: viewer.readFloat32Array(3),
			health: viewer.readInt32(),
			crosshairangle: viewer.readFloat32Array(3),
			viewsize: viewer.readFloat32(),
			punchangle: viewer.readFloat32Array(3),
			maxclients: viewer.readInt32(),
			viewentity: viewer.readInt32(),
			playernum: viewer.readInt32(),
			max_entities: viewer.readInt32(),
			demoplayback: viewer.readInt32(),
			hardware: viewer.readInt32(),
			smoothing: viewer.readInt32(),
			ptr_cmd: viewer.readInt32(),
			ptr_movelets: viewer.readInt32(),
			viewport: viewer.readInt32Array(4),
			nextView: viewer.readInt32(),
			onlyClientDraw: viewer.readInt32(),
		},

		userCmd: {
			lerp_msec: viewer.readInt16(),
			msec: viewer.readUint8(),
			align_1: viewer.readInt8(),
			viewangles: viewer.readFloat32Array(3),
			forwardmove: viewer.readFloat32(),
			sidemove: viewer.readFloat32(),
			upmove: viewer.readFloat32(),
			lightlevel: viewer.readInt8(),
			align_2: viewer.readInt8(),
			buttons: viewer.readUint16(),
			impulse: viewer.readInt8(),
			weaponselect: viewer.readInt8(),
			align_3: viewer.readInt8(),
			align_4: viewer.readInt8(),
			impact_index: viewer.readInt32(),
			impact_position: viewer.readFloat32Array(3),
		},

		moveVars: {
			gravity: viewer.readFloat32(),
			stopspeed: viewer.readFloat32(),
			maxspeed: viewer.readFloat32(),
			spectatormaxspeed: viewer.readFloat32(),
			accelerate: viewer.readFloat32(),
			airaccelerate: viewer.readFloat32(),
			wateraccelerate: viewer.readFloat32(),
			friction: viewer.readFloat32(),
			edgefriction: viewer.readFloat32(),
			waterfriction: viewer.readFloat32(),
			entgravity: viewer.readFloat32(),
			bounce: viewer.readFloat32(),
			stepsize: viewer.readFloat32(),
			maxvelocity: viewer.readFloat32(),
			zmax: viewer.readFloat32(),
			waveHeight: viewer.readFloat32(),
			footsteps: viewer.readInt32(),
			skyName: viewer.readString(FRAME_SKYNAME_SIZE),
			rollangle: viewer.readFloat32(),
			rollspeed: viewer.readFloat32(),
			skycolor_r: viewer.readFloat32(),
			skycolor_g: viewer.readFloat32(),
			skycolor_b: viewer.readFloat32(),
			skyvec_x: viewer.readFloat32(),
			skyvec_y: viewer.readFloat32(),
			skyvec_z: viewer.readFloat32(),
		},

		view: viewer.readFloat32Array(3),
		viewmodel: viewer.readInt32(),
	};

	frame.incoming_sequence = viewer.readInt32();
	frame.incoming_acknowledged = viewer.readInt32();
	frame.incoming_reliable_acknowledged = viewer.readInt32();
	frame.incoming_reliable_sequence = viewer.readInt32();
	frame.outgoing_sequence = viewer.readInt32();
	frame.reliable_sequence = viewer.readInt32();
	frame.last_reliable_sequence = viewer.readInt32();

	const length = viewer.readInt32();
	frame.msg = viewer.readUint8Array(length);

	return true;
}

function readDemoHeader(viewer) {
	if (viewer.readString(6) !== 'HLDEMO') {
		throw new ParseException('incorrect file signature');
	}

	viewer.skip(2);

	return {
		demoProtocol: viewer.readInt32(),
		netProtocol: viewer.readInt32(),
		mapName: viewer.readString(HEADER_MAPNAME_SIZE),
		gameDirectory: viewer.readString(HEADER_GAMEDIRECTORY_SIZE),
		mapCRC: viewer.readInt32(),
		directoryOffset: viewer.readInt32(),
	};
}

function readDemoDirectory(viewer, directoryOffset) {
	if (directoryOffset < 0 || viewer.view.buffer.byteLength - 4 < directoryOffset) {
		throw new ParseException('invalid directory offset');
	}

	viewer.seekBeg(directoryOffset);

	const entryCount = viewer.readInt32();
	if (entryCount < DIRECTORY_ENTRY_COUNT_MIN || entryCount > DIRECTORY_ENTRY_COUNT_MAX) {
		throw new ParseException('invalid number of directory entries');
	}

	const directoryEntries = [];
	for (let i = 0; i < entryCount; ++i) {
		directoryEntries.push({
			type: viewer.readInt32(),
			description: viewer.readString(DIRECTORY_ENTRY_DESCRIPTION_SIZE),
			flags: viewer.readInt32(),
			CDtrack: viewer.readInt32(),
			trackTime: viewer.readFloat32(),
			frameCount: viewer.readInt32(),
			offset: viewer.readInt32(),
			fileLength: viewer.readInt32(),
		});
	}

	return directoryEntries;
}

function readDemoFrame(viewer) {
	const frame = {
		type: viewer.readUint8(),
		time: viewer.readFloat32(),
		frame: viewer.readInt32(),
	};

	let stop;
	if (FRAME_TYPE_MIN <= frame.type && frame.type <= FRAME_TYPE_MAX) {
		stop = !FRAME_READERS[frame.type](viewer, frame);
	} else {
		stop = !readNetMessageFrame(viewer, frame);
	}

	return { frame, stop };
}

function readDemoFrames(viewer, header, directoryEntries) {
	if (header.demoProtocol !== 5) {
		throw new ParseException('only demo protocol 5 is supported');
	}

	for (let i = 0; i < directoryEntries.length; ++i) {
		const entry = directoryEntries[i];
		if (entry.offset < 0 || viewer.view.buffer.byteLength < entry.offset) {
			throw new ParseException('invalid offset in directory entry');
		}

		viewer.seekBeg(entry.offset);
		entry.frames = [];
		let frame;
		do {
			frame = readDemoFrame(viewer);
			entry.frames.push(frame.frame);
		} while (!frame.stop);
	}
}

export default class DemoReader {
	constructor() {
		this.header = {};
		this.directoryEntries = [];
	}

	onready(callback) {
		this.onready = callback;
	}

	onerror(callback) {
		this.onerror = callback;
	}

	parseBuffer(buffer) {
		const viewer = new ViewWrapper(buffer);
		this.header = readDemoHeader(viewer);
		this.directoryEntries = readDemoDirectory(viewer, this.header.directoryOffset);
		readDemoFrames(viewer, this.header, this.directoryEntries);
	}

	parse(file) {
		const fileReader = new FileReader();
		const instance = this;
		fileReader.onload = () => {
			try {
				instance.parseBuffer(fileReader.result);
			} catch (e) {
				if (instance.onerror) {
					instance.onerror(e);
				}
				return;
			}

			if (instance.onready) {
				instance.onready();
			}
		};
		fileReader.onerror = () => {
			instance.onerror(new ParseException('failed to read file'));
		};
		fileReader.readAsArrayBuffer(file);
	}
}
