function checkWord() {
    const word = document.getElementById("wordInput").value;
    if (!word) return;
    const w = word.toLowerCase();
    const n = w.length;

    let result = "";
    let i = 0;

    // Explicit exceptions dictionary: word -> list of silent letters (start index, length)
    const exceptions = {
        "knight": [[0,1],[3,2]],
        "knife": [[0,1]],
        "psychology": [[0,1]],
        "pneumonia": [[0,1]],
        "island": [[1,1]],
        "aisle": [[2,1]],
        "isle": [[1,1]],
        "honest": [[0,1]],
        "hour": [[0,1]],
        "heir": [[0,1]],
        "answer": [[3,1]],
        "ballet": [[5,1]],
        "doubt": [[3,1]],
        "debt": [[2,1]],
        "subtle": [[2,1]],
        "listen": [[3,1]],
        "castle": [[3,1]],
        "often": [[2,1]],
        "receipt": [[5,1]],
        "indict": [[4,1]],
        "gnome": [[0,1]],
        "wring": [[0,1]]
    };

    if (exceptions[w]) {
        let marked = {};
        exceptions[w].forEach(([idx, len]) => marked[idx] = len);
        let j = 0;
        while (j < word.length) {
            if (marked[j] !== undefined) {
                result += `<span class="silent">${word.substr(j, marked[j])}</span>`;
                j += marked[j];
            } else {
                result += word[j];
                j += 1;
            }
        }
        document.getElementById("result").innerHTML = `Result: ${result}`;
        return;
    }

    // Suffix rules
    const suffixRules = {
        'l': ['alm','alk','alf','ould','olk'],  // calm, walk, half, could, yolk
        't': ['tle','sten','ften','ten'],       // castle, listen, often, ten
        'n': ['mn']                             // autumn, hymn
    };

    function checkSuffixRules(i) {
        for (let letter in suffixRules) {
            suffixRules[letter].forEach(suf => {
                if (w.endsWith(suf)) {
                    let posInSuf = suf.indexOf(letter);
                    if (posInSuf !== -1) {
                        let targetIdx = n - suf.length + posInSuf;
                        if (i === targetIdx) return letter;
                    }
                }
            });
        }
        return null;
    }

    while (i < n) {
        // START-of-word rules
        if (i === 0) {
            if (w.startsWith("kn") || w.startsWith("gn") || w.startsWith("wr") || 
                w.startsWith("ps") || w.startsWith("pn") || w.startsWith("pt")) {
                result += `<span class="silent">${word[i]}</span>`;
                i += 1;
                continue;
            }
            if (["honest","hour","heir","herb"].some(x => w.startsWith(x))) {
                result += `<span class="silent">${word[i]}</span>`;
                i += 1;
                continue;
            }
        }

        // GH rules
        if (w.substr(i,2) === "gh") {
            if ((i + 2 === n) || (i + 2 < n && w[i+2] === 't') || 
                ["though","through","dough","bough","tough"].some(x => w.endsWith(x))) {
                result += `<span class="silent">${word.substr(i,2)}</span>`;
                i += 2;
                continue;
            }
        }

        // MB at end
        if (i === n-1 && w[i]==='b' && w[i-1]==='m') {
            result += `<span class="silent">${word[i]}</span>`;
            i +=1;
            continue;
        }

        // MN at end
        if (i === n-1 && w[i]==='n' && w[i-1]==='m') {
            result += `<span class="silent">${word[i]}</span>`;
            i +=1;
            continue;
        }

        // BT inside word
        if (w[i]==='b' && i+1<n && w[i+1]==='t') {
            result += `<span class="silent">${word[i]}</span>`;
            i +=1;
            continue;
        }

        // Suffix rules
        const sufLetter = checkSuffixRules(i);
        if (sufLetter && word[i].toLowerCase() === sufLetter) {
            result += `<span class="silent">${word[i]}</span>`;
            i +=1;
            continue;
        }

        // C in indict
        if (w[i]==='c' && w==="indict") {
            result += `<span class="silent">${word[i]}</span>`;
            i+=1;
            continue;
        }

        // Default: no silent
        result += word[i];
        i +=1;
    }

    document.getElementById("result").innerHTML = `Result: ${result}`;
}
// Speech function to pronounce the word
function speakWord() {
    const word = document.getElementById("wordInput").value;
    if (!word) return;

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 1;       // Speed (0.5-2)
    utterance.pitch = 1;      // Pitch (0-2)
    utterance.lang = 'en-US'; // Language

    window.speechSynthesis.speak(utterance);
}
