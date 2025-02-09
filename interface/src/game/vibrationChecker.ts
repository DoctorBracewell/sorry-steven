
export function checkVibe(userBeats: number[], beats: number[]) {

    let realSpaces: number[] = [];
    let curr_space = 1;
    beats.slice(1).forEach(beat => {
        if (beat == 1) {
            realSpaces.push(curr_space);
            curr_space = 1;
        } else {
            curr_space++;
        }
    });

    const userSpaces = userBeats.slice(1).map((beat, index) => beat - userBeats[index]);
    let min_score = 999999999;
    for (let i = 0; i < userSpaces.length; i++) {

        const ratio = realSpaces[i] / userSpaces[i]
        const relative = userSpaces.map(space => space * ratio);

        const score = Array(userSpaces.length)
            .fill(0)
            .map((_, index) => Math.abs(relative[index] - realSpaces[index]))
            .reduce((acc, diff) => acc + diff, 0);
        
        if (score < min_score) {
            min_score = score;
        }

        console.log(relative);
        console.log(realSpaces)

    }

    console.log(min_score, )

    return min_score < 1.5;

}