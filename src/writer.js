import ViewWrapper from './viewwrapper';
import CONSTS from './common';

const FRAME_WRITERS = [
	() => {},
	() => {},

	// Index 2: DEMO_START
	() => {},

	// Index 3: CONSOLE_COMMAND
	(viewer, frame) => {
		viewer.writeString(frame.command, CONSTS.FRAME_CONSOLE_COMMAND_SIZE);
	},

	// Index 4: CLIENT_DATA
	(viewer, frame) => {
		viewer.writeFloat32Array(frame.origin);
		viewer.writeFloat32Array(frame.viewangles);
		viewer.writeInt32(frame.weaponBits);
		viewer.writeFloat32(frame.fov);
	},

	// Index 5: NEXT_SECTION
	() => {},

	// Index 6: EVENT
	(viewer, frame) => {
		viewer.writeInt32(frame.flags);
		viewer.writeInt32(frame.index);
		viewer.writeFloat32(frame.delay);

		viewer.writeInt32(frame.eventArgs.flags);
		viewer.writeInt32(frame.eventArgs.entityIndex);
		viewer.writeFloat32Array(frame.eventArgs.origin);
		viewer.writeFloat32Array(frame.eventArgs.angles);
		viewer.writeFloat32Array(frame.eventArgs.velocity);
		viewer.writeInt32(frame.eventArgs.ducking);
		viewer.writeFloat32(frame.eventArgs.fparam1);
		viewer.writeFloat32(frame.eventArgs.fparam2);
		viewer.writeInt32(frame.eventArgs.iparam1);
		viewer.writeInt32(frame.eventArgs.iparam2);
		viewer.writeInt32(frame.eventArgs.bparam1);
		viewer.writeInt32(frame.eventArgs.bparam2);
	},

	// Index 7: WEAPON_ANIMATION
	(viewer, frame) => {
		viewer.writeInt32(frame.anim);
		viewer.writeInt32(frame.body);
	},

	// Index 8: SOUND
	(viewer, frame) => {
		viewer.writeInt32(frame.channel);
		viewer.writeInt32(frame.samples.length);
		viewer.writeUint8Array(frame.samples);
		viewer.writeFloat32(frame.attenuation);
		viewer.writeFloat32(frame.volume);
		viewer.writeInt32(frame.flags);
		viewer.writeInt32(frame.pitch);
	},

	// Index 9: DEMO_BUFFER
	(viewer, frame) => {
		viewer.writeInt32(frame.buffer.length);
		viewer.writeUint8Array(frame.buffer);
	},
];

function writeNetMessageFrame(viewer, frame) {
	viewer.writeFloat32(frame.demoInfo.timestamp);

	viewer.writeFloat32Array(frame.demoInfo.refParams.vieworg);
	viewer.writeFloat32Array(frame.demoInfo.refParams.viewangles);
	viewer.writeFloat32Array(frame.demoInfo.refParams.forward);
	viewer.writeFloat32Array(frame.demoInfo.refParams.right);
	viewer.writeFloat32Array(frame.demoInfo.refParams.up);
	viewer.writeFloat32(frame.demoInfo.refParams.frametime);
	viewer.writeFloat32(frame.demoInfo.refParams.time);
	viewer.writeInt32(frame.demoInfo.refParams.intermission);
	viewer.writeInt32(frame.demoInfo.refParams.paused);
	viewer.writeInt32(frame.demoInfo.refParams.spectator);
	viewer.writeInt32(frame.demoInfo.refParams.onground);
	viewer.writeInt32(frame.demoInfo.refParams.waterlevel);
	viewer.writeFloat32Array(frame.demoInfo.refParams.simvel);
	viewer.writeFloat32Array(frame.demoInfo.refParams.simorg);
	viewer.writeFloat32Array(frame.demoInfo.refParams.viewheight);
	viewer.writeFloat32(frame.demoInfo.refParams.idealpitch);
	viewer.writeFloat32Array(frame.demoInfo.refParams.cl_viewangles);
	viewer.writeInt32(frame.demoInfo.refParams.health);
	viewer.writeFloat32Array(frame.demoInfo.refParams.crosshairangle);
	viewer.writeFloat32(frame.demoInfo.refParams.viewsize);
	viewer.writeFloat32Array(frame.demoInfo.refParams.punchangle);
	viewer.writeInt32(frame.demoInfo.refParams.maxclients);
	viewer.writeInt32(frame.demoInfo.refParams.viewentity);
	viewer.writeInt32(frame.demoInfo.refParams.playernum);
	viewer.writeInt32(frame.demoInfo.refParams.max_entities);
	viewer.writeInt32(frame.demoInfo.refParams.demoplayback);
	viewer.writeInt32(frame.demoInfo.refParams.hardware);
	viewer.writeInt32(frame.demoInfo.refParams.smoothing);
	viewer.writeInt32(frame.demoInfo.refParams.ptr_cmd);
	viewer.writeInt32(frame.demoInfo.refParams.ptr_movelets);
	viewer.writeInt32Array(frame.demoInfo.refParams.viewport);
	viewer.writeInt32(frame.demoInfo.refParams.nextView);
	viewer.writeInt32(frame.demoInfo.refParams.onlyClientDraw);

	viewer.writeInt16(frame.demoInfo.userCmd.lerp_msec);
	viewer.writeUint8(frame.demoInfo.userCmd.msec);
	viewer.writeInt8(frame.demoInfo.userCmd.align_1);
	viewer.writeFloat32Array(frame.demoInfo.userCmd.viewangles);
	viewer.writeFloat32(frame.demoInfo.userCmd.forwardmove);
	viewer.writeFloat32(frame.demoInfo.userCmd.sidemove);
	viewer.writeFloat32(frame.demoInfo.userCmd.upmove);
	viewer.writeInt8(frame.demoInfo.userCmd.lightlevel);
	viewer.writeInt8(frame.demoInfo.userCmd.align_2);
	viewer.writeUint16(frame.demoInfo.userCmd.buttons);
	viewer.writeInt8(frame.demoInfo.userCmd.impulse);
	viewer.writeInt8(frame.demoInfo.userCmd.weaponselect);
	viewer.writeInt8(frame.demoInfo.userCmd.align_3);
	viewer.writeInt8(frame.demoInfo.userCmd.align_4);
	viewer.writeInt32(frame.demoInfo.userCmd.impact_index);
	viewer.writeFloat32Array(frame.demoInfo.userCmd.impact_position);

	viewer.writeFloat32(frame.demoInfo.moveVars.gravity);
	viewer.writeFloat32(frame.demoInfo.moveVars.stopspeed);
	viewer.writeFloat32(frame.demoInfo.moveVars.maxspeed);
	viewer.writeFloat32(frame.demoInfo.moveVars.spectatormaxspeed);
	viewer.writeFloat32(frame.demoInfo.moveVars.accelerate);
	viewer.writeFloat32(frame.demoInfo.moveVars.airaccelerate);
	viewer.writeFloat32(frame.demoInfo.moveVars.wateraccelerate);
	viewer.writeFloat32(frame.demoInfo.moveVars.friction);
	viewer.writeFloat32(frame.demoInfo.moveVars.edgefriction);
	viewer.writeFloat32(frame.demoInfo.moveVars.waterfriction);
	viewer.writeFloat32(frame.demoInfo.moveVars.entgravity);
	viewer.writeFloat32(frame.demoInfo.moveVars.bounce);
	viewer.writeFloat32(frame.demoInfo.moveVars.stepsize);
	viewer.writeFloat32(frame.demoInfo.moveVars.maxvelocity);
	viewer.writeFloat32(frame.demoInfo.moveVars.zmax);
	viewer.writeFloat32(frame.demoInfo.moveVars.waveHeight);
	viewer.writeInt32(frame.demoInfo.moveVars.footsteps);
	viewer.writeString(frame.demoInfo.moveVars.skyName,
		CONSTS.FRAME_SKYNAME_SIZE);
	viewer.writeFloat32(frame.demoInfo.moveVars.rollangle);
	viewer.writeFloat32(frame.demoInfo.moveVars.rollspeed);
	viewer.writeFloat32(frame.demoInfo.moveVars.skycolor_r);
	viewer.writeFloat32(frame.demoInfo.moveVars.skycolor_g);
	viewer.writeFloat32(frame.demoInfo.moveVars.skycolor_b);
	viewer.writeFloat32(frame.demoInfo.moveVars.skyvec_x);
	viewer.writeFloat32(frame.demoInfo.moveVars.skyvec_y);
	viewer.writeFloat32(frame.demoInfo.moveVars.skyvec_z);

	viewer.writeFloat32Array(frame.demoInfo.view);
	viewer.writeInt32(frame.demoInfo.viewmodel);

	viewer.writeInt32(frame.incoming_sequence);
	viewer.writeInt32(frame.incoming_acknowledged);
	viewer.writeInt32(frame.incoming_reliable_acknowledged);
	viewer.writeInt32(frame.incoming_reliable_sequence);
	viewer.writeInt32(frame.outgoing_sequence);
	viewer.writeInt32(frame.reliable_sequence);
	viewer.writeInt32(frame.last_reliable_sequence);

	viewer.writeInt32(frame.msg.length);
	viewer.writeUint8Array(frame.msg);
}

export default class DemoWriter {
	constructor() {
		this.fileUrl = null;
	}

	getBlobUrl(buffer) {
		if (this.fileUrl !== null) {
			// Revoke to prevent memory leaks.
			URL.revokeObjectURL(this.fileUrl);
		}

		const blob = new Blob([buffer], { type: 'application/octet-binary' });
		this.fileUrl = URL.createObjectURL(blob);
		return this.fileUrl;
	}

	save(demoSize, header, directoryEntries) {
		// Make room for potential NEXT_SECTION frame we have to insert.
		const buffer = new ArrayBuffer(demoSize + CONSTS.FRAME_SIZE_MIN);
		const viewer = new ViewWrapper(buffer);

		// Write file signature.
		viewer.writeString('HLDEMO', 8);

		// Write header.
		viewer.writeInt32(header.demoProtocol);
		viewer.writeInt32(header.netProtocol);
		viewer.writeString(header.mapName, CONSTS.HEADER_MAPNAME_SIZE);
		viewer.writeString(header.gameDirectory, CONSTS.HEADER_GAMEDIRECTORY_SIZE);
		viewer.writeInt32(header.mapCRC);
		// Delay the writing of directoryOffset.
		const directoryOffsetPos = viewer.offset;
		viewer.skip(4);

		const entryOffsets = [];
		for (let i = 0; i < directoryEntries.length; ++i) {
			const directoryEntry = directoryEntries[i];
			// Save the offset for later writing.
			entryOffsets.push(viewer.offset);

			// A NEXT_SECTION frame needs to be written in case there isn't
			// one this directory entry, or the engine might not play the demo
			// correctly.
			let hasWrittenNextSection = false;

			for (let j = 0; j < directoryEntry.frames.length; ++j) {
				const frame = directoryEntry.frames[j];
				viewer.writeUint8(frame.type);
				viewer.writeFloat32(frame.time);
				viewer.writeInt32(frame.frame);

				if (CONSTS.FRAME_TYPE_MIN <= frame.type
					&& frame.type <= CONSTS.FRAME_TYPE_MAX) {
					FRAME_WRITERS[frame.type](viewer, frame);
				} else {
					writeNetMessageFrame(viewer, frame);
				}

				if (frame.type === CONSTS.FRAME_TYPE_NEXT_SECTION) {
					hasWrittenNextSection = true;
				}
			}

			if (!hasWrittenNextSection) {
				viewer.writeUint8(CONSTS.FRAME_TYPE_NEXT_SECTION);
				viewer.writeFloat32(0);
				viewer.writeInt32(0);
			}
		}

		const directoryOffset = viewer.offset;
		viewer.writeInt32(directoryEntries.length);

		for (let i = 0; i < directoryEntries.length; ++i) {
			const directoryEntry = directoryEntries[i];
			viewer.writeInt32(directoryEntry.type);
			viewer.writeString(
				directoryEntry.description,
				CONSTS.DIRECTORY_ENTRY_DESCRIPTION_SIZE);
			viewer.writeInt32(directoryEntry.flags);
			viewer.writeInt32(directoryEntry.CDtrack);
			viewer.writeFloat32(directoryEntry.trackTime);
			viewer.writeInt32(directoryEntry.frameCount);
			// Use the offset saved previously.
			viewer.writeInt32(entryOffsets[i]);
			viewer.writeInt32(directoryEntry.fileLength);
		}

		// Now we get to write the directory offset.
		viewer.seekBeg(directoryOffsetPos);
		viewer.writeInt32(directoryOffset);

		return this.getBlobUrl(buffer);
	}
}
