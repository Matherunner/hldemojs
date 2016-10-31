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

	readUint8() {
		const ret = this.view.getUint8(this.offset, true);
		this.offset += 1;
		return ret;
	}

	readInt16() {
		const ret = this.view.getInt16(this.offset, true);
		this.offset += 2;
		return ret;
	}

	readUint16() {
		const ret = this.view.getUint16(this.offset, true);
		this.offset += 2;
		return ret;
	}

	readInt32() {
		const ret = this.view.getInt32(this.offset, true);
		this.offset += 4;
		return ret;
	}

	readUint32() {
		const ret = this.view.getUint32(this.offset, true);
		this.offset += 4;
		return ret;
	}

	readFloat32() {
		const ret = this.view.getFloat32(this.offset, true);
		this.offset += 4;
		return ret;
	}

	readUint8Array(length) {
		const array = new Uint8Array(this.view.buffer, this.offset, length);
		this.offset += length;
		return array;
	}

	readString(length) {
		const array = this.readUint8Array(length);
		let string = '';
		for (let i = 0; i < array.length && array[i]; ++i) {
			string += String.fromCharCode(array[i]);
		}
		return string;
	}

	readFloat32Array(length) {
		const array = [];
		for (let i = 0; i < length; ++i) {
			array.push(this.readFloat32());
		}
		return array;
	}

	readInt32Array(length) {
		const array = [];
		for (let i = 0; i < length; ++i) {
			array.push(this.readInt32());
		}
		return array;
	}

	skip(offset) {
		this.offset += offset;
	}

	seekBeg(offset) {
		this.offset = offset;
	}
}
