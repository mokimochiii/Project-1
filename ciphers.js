document.addEventListener('DOMContentLoaded', (event) => {

    class CaesarCipher {
        constructor(shift = 3) {
            this.NAME = 'Caesar';
            this.shift = shift;
            this.chars = 256;
        }

        encode(text) {
            if (typeof text === 'string') {
                return Array.from(text).map(i => (i.charCodeAt(0) + this.shift) % 256).map(num => num.toString(2).padStart(8, '0')).join('');
            } else {
                return "Format error";
            }
        }

        decode(data) {
            let binary = [];
            for (let i = 0; i < data.length; i += 8) {
                let byte = data.slice(i, i + 8);
                let byteint = (parseInt(byte, 2) - this.shift) % 256;
                let newnum = byteint.toString(2).padStart(8, '0');
                binary.push(newnum);
            }
            let text = '';
            for (let byte of binary) {
                text += String.fromCharCode(parseInt(byte, 2));
            }
            return text;
        }
    }

    class Playfair {
        constructor() {
            this.NAME = 'Playfair';
            this.table = [
                ['L', 'O', 'V', 'E', 'A'],
                ['B', 'C', 'D', 'F', 'G'],
                ['H', 'I', 'K', 'M', 'N'],
                ['P', 'Q', 'R', 'S', 'T'],
                ['U', 'W', 'X', 'Y', 'Z']
            ];
        }

        prepareText(text) {
            let cleanedText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
            let pairs = [];

            for (let i = 0; i < cleanedText.length; i += 2) {
                let pair = cleanedText[i];
                if (i + 1 < cleanedText.length) {
                    if (cleanedText[i] === cleanedText[i + 1]) {
                        if (cleanedText[i] === 'X') {
                            pair += 'X';
                            pairs.push(pair);
                            continue;
                        }
                        pair += 'X';
                        i--;
                    } else {
                        pair += cleanedText[i + 1];
                    }
                } else {
                    pair += 'X';
                }
                pairs.push(pair);
            }
            return pairs;
        }

        findPosition(char) {
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (this.table[row][col] === char) {
                        return [row, col];
                    }
                }
            }
            return null;
        }

        encodePair(pair) {
            let [row1, col1] = this.findPosition(pair[0]);
            let [row2, col2] = this.findPosition(pair[1]);

            if (row1 === row2) {
                return this.table[row1][(col1 + 1) % 5] + this.table[row2][(col2 + 1) % 5];
            } else if (col1 === col2) {
                return this.table[(row1 + 1) % 5][col1] + this.table[(row2 + 1) % 5][col2];
            } else {
                return this.table[row1][col2] + this.table[row2][col1];
            }
        }

        decodePair(pair) {
            let [row1, col1] = this.findPosition(pair[0]);
            let [row2, col2] = this.findPosition(pair[1]);

            if (row1 === row2) {
                return this.table[row1][(col1 + 4) % 5] + this.table[row2][(col2 + 4) % 5];
            } else if (col1 === col2) {
                return this.table[(row1 + 4) % 5][col1] + this.table[(row2 + 4) % 5][col2];
            } else {
                return this.table[row1][col2] + this.table[row2][col1];
            }
        }

        encode(text) {
            let pairs = this.prepareText(text);
            let encoded = pairs.map(pair => this.encodePair(pair)).join('');
            return encoded;
        }

        decode(data) {
            let pairs = this.prepareText(data);
            let decoded = pairs.map(pair => this.decodePair(pair)).join('');
            return decoded;
        }
    }

    function handleCipher(action) {
        let plaintext = document.getElementById("user-input").value;
        let cipherType = document.getElementById("cipher-type").value;
        let message;

        if (cipherType === 'caesar') {
            let caesar = new CaesarCipher();
            message = action === 'encode' ? caesar.encode(plaintext) : caesar.decode(plaintext);
        } else if (cipherType === 'playfair') {
            let playfair = new Playfair();
            message = action === 'encode' ? playfair.encode(plaintext) : playfair.decode(plaintext);
        }

        document.getElementById("output").innerText = message;
    }

    document.getElementById('encrypt-button').addEventListener('click', () => handleCipher('encode'));
    document.getElementById('decode-button').addEventListener('click', () => handleCipher('decode'));
});
