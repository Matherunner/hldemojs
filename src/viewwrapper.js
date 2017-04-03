export default class ViewWrapper {
	constructor(buffer) {
		this.view = new DataView(buffer);
		this.offset = 0;
	}

	readInt8() {
		const ret = this.view.getInt8(this.offset, true);
		this.offset += 1;
		return ret;
	}

	writeInt8(value) {
		this.view.setInt8(this.offset, value);
		this.offset += 1;
	}

	readUint8() {
		const ret = this.view.getUint8(this.offset, true);
		this.offset += 1;
		return ret;
	}

	writeUint8(value) {
		this.view.setUint8(this.offset, value);
		this.offset += 1;
	}

	readInt16() {
		const ret = this.view.getInt16(this.offset, true);
		this.offset += 2;
		return ret;
	}

	writeInt16(value) {
		this.view.setInt16(this.offset, value, true);
		this.offset += 2;
	}

	readUint16() {
		const ret = this.view.getUint16(this.offset, true);
		this.offset += 2;
		return ret;
	}

	writeUint16(value) {
		this.view.setUint16(this.offset, value, true);
		this.offset += 2;
	}

	readInt32() {
		const ret = this.view.getInt32(this.offset, true);
		this.offset += 4;
		return ret;
	}

	writeInt32(value) {
		this.view.setInt32(this.offset, value, true);
		this.offset += 4;
	}

	readUint32() {
		const ret = this.view.getUint32(this.offset, true);
		this.offset += 4;
		return ret;
	}

	writeUint32(value) {
		this.view.setUint32(this.offset, value, true);
		this.offset += 4;
	}

	readFloat32() {
		const ret = this.view.getFloat32(this.offset, true);
		this.offset += 4;
		return ret;
	}

	writeFloat32(value) {
		this.view.setFloat32(this.offset, value, true);
		this.offset += 4;
	}

	readUint8Array(length) {
		const array = new Uint8Array(this.view.buffer, this.offset, length);
		this.offset += length;
		return array;
	}

	writeUint8Array(array) {
		for (let i = 0; i < array.length; ++i) {
			this.writeUint8(array[i]);
		}
	}

	readString(length) {
		const array = this.readUint8Array(length);
		let string = '';
		for (let i = 0; i < array.length && array[i]; ++i) {
			string += String.fromCharCode(array[i]);
		}
		return string;
	}

	writeString(string, length) {
		for (let i = 0; i < string.length; ++i) {
			this.writeUint8(string.charCodeAt(i));
		}

		// Pad the rest with null bytes.
		for (let i = 0; i < length - string.length; ++i) {
			this.writeUint8(0);
		}
	}

	readFloat32Array(length) {
		const array = [];
		for (let i = 0; i < length; ++i) {
			array.push(this.readFloat32());
		}
		return array;
	}

	writeFloat32Array(array) {
		for (let i = 0; i < array.length; ++i) {
			this.writeFloat32(array[i]);
		}
	}

	readInt32Array(length) {
		const array = [];
		for (let i = 0; i < length; ++i) {
			array.push(this.readInt32());
		}
		return array;
	}

	writeInt32Array(array) {
		for (let i = 0; i < array.length; ++i) {
			this.writeInt32(array[i]);
		}
	}

	skip(offset) {
		this.offset += offset;
	}

	seekBeg(offset) {
		this.offset = offset;
	}
}
