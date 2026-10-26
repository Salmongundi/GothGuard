
export function createAsciiAnimation({ frames, draw, onOnceComplete }) {
    let timer = null;
    let stopped = false;
    let onceIndex = 0;
    let loopIndex = 0;

    const onceFrames = frames.filter(frame => frame.playback === "Once");
    const loopingFrames = frames.filter(frame => frame.playback === "Looping");

    function scheduleNext(frame, callback) {
        const duration = Math.max(1, Number(frame.durationMs) || 550);

        timer = setTimeout(() => {
            if (!stopped) {
                callback();
            }
        }, duration);
    }

    function playLoop() {
        if (stopped || loopingFrames.length === 0) return;

        const frame = loopingFrames[loopIndex];
        draw(frame);

        loopIndex = (loopIndex + 1) % loopingFrames.length;
        scheduleNext(frame, playLoop);
    }

    function playOnce() {
        if (stopped) return;

        if (onceIndex >= onceFrames.length) {
            onOnceComplete();
            playLoop();
            return;
        }

        const frame = onceFrames[onceIndex];
        draw(frame);

        onceIndex += 1;
        scheduleNext(frame, playOnce);
    }

    if (onceFrames.length > 0) {
        playOnce();
    } else {
        onOnceComplete();
        playLoop();
    }

    return {
        stop() {
            stopped = true;
            clearTimeout(timer);
        }
    };
}
