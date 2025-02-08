

export function checkVibe(userBeats: number[], beats: number[]) {

    const userSpaces = userBeats.slice(1).map((beat, index) => beat - userBeats[index]);
    
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

    


}