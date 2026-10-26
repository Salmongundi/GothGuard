
import { createAsciiAnimation } from "../engine/asciiAnimation.js";
import { drawAscii } from "../engine/asciiRenderer.js";
import { showDialogue, clearDialogue } from "./dialogue.js";
import { applyPalette } from "./palette.js";

const DATA_PATH = "./data/gameData.json";
const ART_PATH = "./assets/ascii/";

const canvas = document.getElementById("gameCanvas");
const statusElement = document.getElementById("status");
const paletteSelect = document.getElementById("paletteSelect");

let gameData;
let currentAnimation = null;
let currentPalette = applyPalette(paletteSelect.value);
let currentArtwork = null;
let transitionId = 0;

const artCache = new Map();

async function loadArt(artId) {
    if (artCache.has(artId)) {
        return artCache.get(artId);
    }

    const response = await fetch(
        `${ART_PATH}${encodeURIComponent(artId)}.txt`
    );

    if (!response.ok) {
        throw new Error(`Could not load art file: ${artId}.txt`);
    }

    const artwork = (await response.text())
        .replace(/\r/g, "")
        .replace(/\n$/, "");

    artCache.set(artId, artwork);
    return artwork;
}

async function loadNodeArt(node) {
    const placements = [...(node.art ?? [])].sort(
        (a, b) => Number(a.order) - Number(b.order)
    );

    return Promise.all(
        placements.map(async placement => ({
            ...placement,
            artwork: await loadArt(placement.artId)
        }))
    );
}

function drawCurrentArtwork() {
    if (currentArtwork !== null) {
        drawAscii(canvas, currentArtwork, currentPalette);
    }
}

async function showNode(nodeId) {
    const thisTransition = ++transitionId;
    const node = gameData.nodes[nodeId];

    if (!node) {
        throw new Error(`Node not found: ${nodeId}`);
    }

    if (currentAnimation) {
        currentAnimation.stop();
        currentAnimation = null;
    }

    clearDialogue();

    let artFrames;

    try {
        artFrames = await loadNodeArt(node);
    } catch (error) {
        // Ignore errors from a node we have already left.
        if (thisTransition !== transitionId) return;
        throw error;
    }

    // Another node may have been selected while the art was loading.
    if (thisTransition !== transitionId) return;

    statusElement.textContent = "";

    currentAnimation = createAsciiAnimation({
        frames: artFrames,

        draw(frame) {
            currentArtwork = frame.artwork;
            drawCurrentArtwork();
        },

        onOnceComplete() {
            if (thisTransition !== transitionId) return;

            showDialogue(node, destinationNode => {
                if (destinationNode === null) {
                    showNode(gameData.startNode).catch(showError);
                    return;
                }

                showNode(destinationNode).catch(showError);
            });
        }
    });
}

function showError(error) {
    console.error(error);
    statusElement.textContent = error.message || "Something went wrong.";
}

paletteSelect.addEventListener("change", () => {
    currentPalette = applyPalette(paletteSelect.value);
    drawCurrentArtwork();
});

// Redraw the current frame when the window is resized.
window.addEventListener("resize", drawCurrentArtwork);

async function startGame() {
    try {
        statusElement.textContent = "Loading game...";

        const response = await fetch(DATA_PATH);

        if (!response.ok) {
            throw new Error("Could not load data/gameData.json");
        }

        gameData = await response.json();

        if (!gameData.startNode || !gameData.nodes?.[gameData.startNode]) {
            throw new Error("The game data has no valid start node.");
        }

        await showNode(gameData.startNode);
    } catch (error) {
        showError(error);
    }
}

startGame();
