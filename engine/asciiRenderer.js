
export function drawAscii(canvas, artwork, palette) {
    const context = canvas.getContext("2d");
    const lines = artwork.replace(/\r/g, "").replace(/\n$/, "").split("\n");

    const columns = Math.max(1, ...lines.map(line => line.length));
    const rows = Math.max(1, lines.length);

    const fontSize = 16;
    const characterWidth = fontSize * 0.62;
    const lineHeight = fontSize * 1.15;

    const artworkWidth = columns * characterWidth;
    const artworkHeight = rows * lineHeight;

    // Match the canvas's internal dimensions to its fixed CSS display size.
    const width = Math.max(1, Math.round(canvas.clientWidth));
    const height = Math.max(1, Math.round(canvas.clientHeight));

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    context.fillStyle = palette.background;
    context.fillRect(0, 0, width, height);

    const scale = Math.min(
        width / artworkWidth,
        height / artworkHeight,
        1
    );

    const offsetX = (width - artworkWidth * scale) / 2;
    const offsetY = (height - artworkHeight * scale) / 2;

    context.save();
    context.translate(offsetX, offsetY);
    context.scale(scale, scale);

    context.fillStyle = palette.foreground;
    context.font = `${fontSize}px monospace`;
    context.textBaseline = "top";

    lines.forEach((line, index) => {
        context.fillText(line, 0, index * lineHeight);
    });

    context.restore();
}
